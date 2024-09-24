package com.lagunapools.lagunapools.app.clients.controller;

import com.lagunapools.lagunapools.app.clients.models.AllClientsRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AllClientsResponseDTO;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import com.lagunapools.lagunapools.app.clients.service.ClientsService;
import com.lagunapools.lagunapools.common.interefaces.PreAuthorizeLagunaRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("clients")
public class ClientsController {

    private final ClientsService clientsService;

    @PreAuthorizeLagunaRoles
    @GetMapping("/all")
    public AllClientsResponseDTO getClients(@RequestBody AllClientsRequestDTO request) {
        return clientsService.getAllClients(request);
    }

    @PreAuthorizeLagunaRoles
    @PostMapping
    public ResponseEntity<?> addClient(@RequestBody ClientDTO client) {
        return clientsService.addClient(client);
    }

    @PreAuthorizeLagunaRoles
    @GetMapping
    public ResponseEntity<?> getClient(@RequestParam Long clientId) {
        return clientsService.getClient(clientId);
    }
}


