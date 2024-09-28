package com.lagunapools.lagunapools.app.clients.controller;

import com.lagunapools.lagunapools.app.clients.models.AllClientsRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AllClientsResponseDTO;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import com.lagunapools.lagunapools.app.clients.models.GroupDTO;
import com.lagunapools.lagunapools.app.clients.service.ClientsService;
import com.lagunapools.lagunapools.common.interefaces.PreAuthorizeLagunaRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@PreAuthorizeLagunaRoles
@RequestMapping("clients")
public class ClientsController {

    private final ClientsService clientsService;

    @GetMapping("/all")
    public AllClientsResponseDTO getClients(@ModelAttribute AllClientsRequestDTO request) {
        return clientsService.getAllClients(request);
    }

    @PostMapping
    public ResponseEntity<?> addClient(@RequestBody ClientDTO client) {
        return clientsService.addClient(client);
    }

    @GetMapping
    public ResponseEntity<?> getClient(@RequestParam Long clientId) {
        return clientsService.getClient(clientId);
    }

    @GetMapping({"/list_groups"})
    @Cacheable(value = "groupsList")
    public List<GroupDTO> listGroups() {
        return clientsService.listGroups();
    }
}


