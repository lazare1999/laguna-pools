package com.lagunapools.lagunapools.app.clients.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AllClientsRequestDTO implements Serializable {
    private Integer pageKey;
    private Integer pageSize;
    private String clientName;
}
