package com.lagunapools.lagunapools.app.clients.controller;

import com.lagunapools.lagunapools.app.clients.models.AllClientsRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AllClientsResponseDTO;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import com.lagunapools.lagunapools.app.clients.service.ClientsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("clients")
@RequiredArgsConstructor
public class ClientsController {
    ClientsService clientsService;

    @GetMapping
    public AllClientsResponseDTO getClients(@RequestBody AllClientsRequestDTO request) {
        return clientsService.getAllClients(request);
    }

    @PostMapping
    public ResponseEntity<?> addClient(@RequestBody ClientDTO client) {
        return clientsService.addClient(client);
    }
}
