package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.branches.repository.BranchEntity;
import com.lagunapools.lagunapools.app.branches.repository.BranchRepository;
import com.lagunapools.lagunapools.app.clients.models.AllClientsRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AllClientsResponseDTO;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import com.lagunapools.lagunapools.app.clients.models.GroupDTO;
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

        var clientPage = clientsRepository.findAll((root, query, builder) -> {

            Objects.requireNonNull(query).distinct(true);
            Predicate predicate = builder.conjunction();

            if (StringUtils.isNotEmpty(request.getClientName())) {
                predicate = builder.and(predicate, builder.like(root.get("firstName"), "%" + request.getClientName() + "%"));
            }

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


}
