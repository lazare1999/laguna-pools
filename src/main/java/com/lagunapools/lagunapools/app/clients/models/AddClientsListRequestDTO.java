package com.lagunapools.lagunapools.app.clients.models;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AddClientsListRequestDTO {
    private List<ClientDTO> clients;
}
