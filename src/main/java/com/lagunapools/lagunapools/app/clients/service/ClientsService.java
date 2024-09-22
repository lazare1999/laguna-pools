package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.AllClientsRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AllClientsResponseDTO;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import org.springframework.http.ResponseEntity;

public interface ClientsService {

    ResponseEntity<?> addClient(ClientDTO client);

    AllClientsResponseDTO getAllClients(AllClientsRequestDTO request);
}
