package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.AllClientsRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AllClientsResponseDTO;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import com.lagunapools.lagunapools.app.clients.repository.ClientEntity;
import com.lagunapools.lagunapools.app.clients.repository.ClientsRepository;
import com.lagunapools.lagunapools.app.clients.repository.GroupRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

import static com.lagunapools.lagunapools.utils.ResponseUtils.badRequestResponse;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

@Service
public class ClientsServiceImpl implements ClientsService {
    private final ClientsRepository clientsRepository;
    private final GroupRepository groupRepository;

    public ClientsServiceImpl(ClientsRepository clientsRepository, GroupRepository groupRepository) {
        this.clientsRepository = clientsRepository;
        this.groupRepository = groupRepository;
    }

    @Override
    public ResponseEntity<?> addClient(ClientDTO client) {
        try {
            ClientEntity newClient = new ClientEntity(client);
            newClient.setGroup(groupRepository.getReferenceById(client.getGroupId()));
            clientsRepository.save(newClient);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequestResponse(ex.getStackTrace());
        }
        return okResponse(true);
    }

    @Override
    public AllClientsResponseDTO getAllClients(AllClientsRequestDTO request) {
        if (Objects.isNull(request)
                || request.getPageKey() == null
                || request.getPageSize() == null) {
            return new AllClientsResponseDTO();
        }

        Pageable pageable = PageRequest.of(request.getPageKey(), request.getPageSize());


        Page<ClientEntity> clientPage = clientsRepository.findAll(pageable);
        List<ClientDTO> clientsList = clientPage.stream().map(ClientDTO::new).toList();

        return new AllClientsResponseDTO(clientPage.getTotalElements(), clientsList);
    }
}
