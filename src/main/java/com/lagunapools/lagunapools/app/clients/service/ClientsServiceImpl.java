package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.branches.repository.BranchEntity;
import com.lagunapools.lagunapools.app.branches.repository.BranchRepository;
import com.lagunapools.lagunapools.app.clients.models.AddClientsListRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AllClientsRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AllClientsResponseDTO;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import com.lagunapools.lagunapools.app.clients.models.groups.GroupDTO;
import com.lagunapools.lagunapools.app.clients.models.groups.GroupMapper;
import com.lagunapools.lagunapools.app.clients.repository.ClientsEntity;
import com.lagunapools.lagunapools.app.clients.repository.ClientsRepository;
import com.lagunapools.lagunapools.app.clients.repository.GroupEntity;
import com.lagunapools.lagunapools.app.clients.repository.GroupRepository;
import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.app.user.services.MyUserDetailsService;
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

    private final MyUserDetailsService userDetailsService;

    @Override
    public AllClientsResponseDTO getAllClients(AllClientsRequestDTO request) {
        if (Objects.isNull(request)
                || request.getPageKey() == null
                || request.getPageSize() == null) {
            return new AllClientsResponseDTO();
        }

        boolean isAdmin = userDetailsService.userIsAdmin();

        Page<ClientsEntity> clientPage = clientsRepository.findAll((root, query, builder) -> {
            Objects.requireNonNull(query).distinct(true);
            Predicate predicate = builder.conjunction();

            if (isAdmin && !request.getBranches().isEmpty()) {
                predicate = builder.and(predicate, builder.in(root.get("branch").get("branchName")).value(request.getBranches()));
            } else if (!isAdmin) {
                Optional<AppUser> currentUserOpt = userRepository.findById(getCurrentApplicationUser().getUserId());
                if (currentUserOpt.isPresent()) {
                    AppUser currentUser = currentUserOpt.get();
                    predicate = builder.and(predicate, builder.equal(root.get("branch").get("branchName"), currentUser.getBranch().getBranchName()));
                }
            }

            if (StringUtils.isNotEmpty(request.getName()))
                predicate = builder.and(predicate, builder.like(root.get("firstName"), "%" + request.getName() + "%"));

            if (StringUtils.isNotEmpty(request.getLastName()))
                predicate = builder.and(predicate, builder.like(root.get("lastName"), "%" + request.getLastName() + "%"));

            if (StringUtils.isNotEmpty(request.getPhone()))
                predicate = builder.and(predicate, builder.like(root.get("phoneNumber"), "%" + request.getPhone() + "%"));

            if (StringUtils.isNotEmpty(request.getType()))
                predicate = builder.and(predicate, builder.equal(root.get("type"), request.getType()));

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

            Double debtFrom = request.getDebtFrom();
            Double debtTo = request.getDebtTo();
            if (debtFrom != null && debtTo != null) {
                if (debtFrom.equals(debtTo) && debtFrom != 0.0) {
                    predicate = builder.and(predicate,
                            builder.equal(root.get("debt"), debtFrom));
                } else if (debtFrom != 0.0 && debtTo != 0.0) {
                    predicate = builder.and(predicate,
                            builder.between(root.get("debt"), debtFrom, debtTo));
                } else if (debtFrom != 0.0) {
                    predicate = builder.and(predicate,
                            builder.greaterThanOrEqualTo(root.get("debt"), debtFrom));
                } else if (debtTo != 0.0) {
                    predicate = builder.and(predicate,
                            builder.lessThanOrEqualTo(root.get("debt"), debtTo));
                }
            }

            if (StringUtils.isNotEmpty(request.getDay()))
                predicate = builder.and(predicate, builder.equal(root.get("groups").get("day"), request.getDay()));

            if (StringUtils.isNotEmpty(request.getHour()))
                predicate = builder.and(predicate, builder.equal(root.get("groups").get("hour"), request.getHour()));

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
        if (userDetailsService.userIsAdmin()) {
            return badRequestResponse("Admin not allowed to add client");
        }

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
    @Transactional
    public ResponseEntity<?> deleteClient(Long clientId) {
        if (userDetailsService.userIsAdmin()) {
            return okResponse("Admin not allowed to Delete client");
        }

        if (clientId == null) {
            return badRequestResponse("Client id is null");
        }

        Optional<ClientsEntity> c0 = clientsRepository.findById(clientId);
        if (c0.isEmpty()) {
            return badRequestResponse("Client not found with id: " + clientId);
        }

        Optional<BranchEntity> commonBranch0 = branchRepository.findById(0L);
        if (commonBranch0.isEmpty()) {
            return badRequestResponse("Branch not found");
        }

        ClientsEntity c = c0.get();
        c.setBranch(commonBranch0.get());
        clientsRepository.save(c);
        return okResponse("Client deleted successfully");
    }

    @Override
    @Cacheable(value = "groupsList")
    public List<GroupDTO> listGroups() {
        return GroupMapper.toDTOs(groupRepository.findAll());
    }

    @Override
    public ResponseEntity<?> addClientsList(AddClientsListRequestDTO clients) {
        if (userDetailsService.userIsAdmin()) {
            return badRequestResponse("Admin not allowed to add client");
        }

        try {
            clients.getClients().forEach(this::addClient);
        } catch (Exception e) {
            return badRequestResponse(e.getStackTrace());
        }
        return okResponse("Clients added");
    }

}
