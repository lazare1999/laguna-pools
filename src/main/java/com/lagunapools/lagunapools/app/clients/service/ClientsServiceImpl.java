package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.branches.repository.BranchEntity;
import com.lagunapools.lagunapools.app.branches.repository.BranchRepository;
import com.lagunapools.lagunapools.app.clients.models.*;
import com.lagunapools.lagunapools.app.clients.repository.ClientsEntity;
import com.lagunapools.lagunapools.app.clients.repository.ClientsRepository;
import com.lagunapools.lagunapools.app.clients.repository.GroupEntity;
import com.lagunapools.lagunapools.app.clients.repository.GroupRepository;
import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.utils.LazoUtils;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUser;
import static com.lagunapools.lagunapools.utils.ResponseUtils.badRequestResponse;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

@Service
@RequiredArgsConstructor
public class ClientsServiceImpl implements ClientsService {

    private final ClientsRepository clientsRepository;
    private final GroupRepository groupRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;

    @Override
    public AllClientsResponseDTO getAllClients(AllClientsRequestDTO request) {
        if (Objects.isNull(request)
                || request.getPageKey() == null
                || request.getPageSize() == null) {
            return new AllClientsResponseDTO();
        }

        Long branchId;
        boolean isAdmin;
        var u = getCurrentApplicationUser();

        boolean hasAdminRole = u.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_LAGUNA_ADMIN"));

        if (!hasAdminRole) {
            isAdmin = false;
            Optional<AppUser> currentUserOpt = userRepository.findById(u.getUserId());
            if (currentUserOpt.isPresent()) {
                AppUser currentUser = currentUserOpt.get();
                branchId = currentUser.getBranch().getId();
            } else {
                return new AllClientsResponseDTO();
            }
        } else {
            branchId = 0L;
            isAdmin = true;
        }

        Page<ClientsEntity> clientPage = clientsRepository.findAll((root, query, builder) -> {
            Objects.requireNonNull(query).distinct(true);
            Predicate predicate = builder.conjunction();

            if (isAdmin && request.getBranchIdFilter() != null) {
                predicate = builder.and(predicate, builder.equal(root.get("branchId"), request.getBranchIdFilter()));
            } else if (!isAdmin) {
                predicate = builder.and(predicate, builder.equal(root.get("branchId"), branchId));
            }

            if (StringUtils.isNotEmpty(request.getName()))
                predicate = builder.and(predicate, builder.like(root.get("firstName"), "%" + request.getName() + "%"));

            if (StringUtils.isNotEmpty(request.getLastName()))
                predicate = builder.and(predicate, builder.like(root.get("lastName"), "%" + request.getLastName() + "%"));

            if (StringUtils.isNotEmpty(request.getPhone()))
                predicate = builder.and(predicate, builder.like(root.get("phoneNumber"), "%" + request.getPhone() + "%"));

            if (StringUtils.isNotEmpty(request.getParent()))
                predicate = builder.and(predicate, builder.like(root.get("parent"), "%" + request.getParent() + "%"));

            if (request.getBirthDayFrom() != null && request.getBirthDayTo() != null) {
                predicate = builder.and(predicate,
                        builder.between(root.get("age"),
                                request.getBirthDayFrom(),
                                request.getBirthDayTo()));
            } else if (request.getBirthDayFrom() != null) {
                predicate = builder.and(predicate,
                        builder.greaterThanOrEqualTo(root.get("age"), request.getBirthDayFrom()));
            } else if (request.getBirthDayTo() != null) {
                predicate = builder.and(predicate,
                        builder.lessThanOrEqualTo(root.get("age"), request.getBirthDayTo()));
            }

            if (request.getExpDayFrom() != null && request.getExpDayTo() != null) {
                predicate = builder.and(predicate,
                        builder.between(root.get("expDate"),
                                request.getExpDayFrom(),
                                request.getExpDayTo()));
            } else if (request.getExpDayFrom() != null) {
                predicate = builder.and(predicate,
                        builder.greaterThanOrEqualTo(root.get("expDate"), request.getExpDayFrom()));
            } else if (request.getExpDayTo() != null) {
                predicate = builder.and(predicate,
                        builder.lessThanOrEqualTo(root.get("expDate"), request.getExpDayTo()));
            }

            if (request.getDocDayFrom() != null && request.getDocDayTo() != null) {
                predicate = builder.and(predicate,
                        builder.between(root.get("doctorCheckTill"),
                                request.getDocDayFrom(),
                                request.getDocDayTo()));
            } else if (request.getDocDayFrom() != null) {
                predicate = builder.and(predicate,
                        builder.greaterThanOrEqualTo(root.get("doctorCheckTill"), request.getDocDayFrom()));
            } else if (request.getDocDayTo() != null) {
                predicate = builder.and(predicate,
                        builder.lessThanOrEqualTo(root.get("doctorCheckTill"), request.getDocDayTo()));
            }

            if (request.getIdStatus() != null && request.getIdStatus())
                predicate = builder.and(predicate, builder.equal(root.get("idStatus"), request.getIdStatus()));

            if (request.getContractStatus() != null && request.getContractStatus())
                predicate = builder.and(predicate, builder.equal(root.get("contractStatus"), request.getContractStatus()));

            if (request.getCostFrom() != null && request.getCostTo() != null) {
                predicate = builder.and(predicate,
                        builder.between(root.get("cost"),
                                request.getCostFrom(),
                                request.getCostTo()));
            } else if (request.getCostFrom() != null) {
                predicate = builder.and(predicate,
                        builder.greaterThanOrEqualTo(root.get("cost"), request.getCostFrom()));
            } else if (request.getCostTo() != null) {
                predicate = builder.and(predicate,
                        builder.lessThanOrEqualTo(root.get("cost"), request.getCostTo()));
            }

            if (request.getSelectedGroups() != null && !request.getSelectedGroups().isEmpty())
                predicate = builder.and(predicate, builder.in(root.get("groups").get("id")).value(request.getSelectedGroups()));

            if (StringUtils.isNotEmpty(request.getNotes()))
                predicate = builder.and(predicate, builder.like(root.get("notes"), "%" + request.getNotes() + "%"));

            return predicate;
        }, PageRequest.of(request.getPageKey(), request.getPageSize(), LazoUtils.getSortAsc("id")));

        List<ClientDTO> clientsList = clientPage.stream().map(ClientDTO::new).toList();

        return new AllClientsResponseDTO(clientPage.getTotalElements(), clientsList);
    }

    private List<GroupEntity> addGroupsIfNotExists(List<GroupDTO> groups) {
        return groups.stream()
                .map(g -> groupRepository.findByDayAndHour(g.getDay(), g.getHour())
                        .orElseGet(() -> groupRepository.save(new GroupEntity(g.getDay(), g.getHour()))))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = "groupsList", allEntries = true)
    public ResponseEntity<?> addClient(ClientDTO client) {
        try {
            Optional<AppUser> currentUser0 = userRepository.findById(getCurrentApplicationUser().getUserId());
            if (currentUser0.isEmpty())
                return badRequestResponse("User not found");

            AppUser currentUser = currentUser0.get();
            List<GroupEntity> savedGroups = addGroupsIfNotExists(client.getGroups());

            ClientsEntity newClient = new ClientsEntity(client, currentUser.getUsername());
            newClient.setGroups(savedGroups);

            BranchEntity branch = branchRepository.getBranchEntitiesByBranchName(currentUser.getBranch().getBranchName());
            newClient.setBranch(branch);

            clientsRepository.save(newClient);
        } catch (Exception ex) {
            return badRequestResponse("Error saving new client");
        }
        return okResponse("Client added successfully");
    }

    @Override
    public ResponseEntity<?> getClient(Long clientId) {
        return okResponse(clientsRepository.findById(clientId));
    }

    @Override
    @Cacheable(value = "groupsList")
    public List<GroupDTO> listGroups() {
        return GroupMapper.toDTOs(groupRepository.findAll());
    }

}
