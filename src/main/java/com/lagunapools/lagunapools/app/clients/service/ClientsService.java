package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.AllClientsRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AllClientsResponseDTO;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import com.lagunapools.lagunapools.app.clients.models.GroupDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ClientsService {

    AllClientsResponseDTO getAllClients(AllClientsRequestDTO request);

    ResponseEntity<?> addClient(ClientDTO client);

    ResponseEntity<?> getClient(Long clientId);

    List<GroupDTO> listGroups();
}
