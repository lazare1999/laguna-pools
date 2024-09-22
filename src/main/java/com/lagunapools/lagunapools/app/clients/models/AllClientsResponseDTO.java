package com.lagunapools.lagunapools.app.clients.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AllClientsResponseDTO {
    private Long total;
    private List<ClientDTO> content;
}
