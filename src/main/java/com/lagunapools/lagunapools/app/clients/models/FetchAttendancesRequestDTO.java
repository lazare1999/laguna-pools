package com.lagunapools.lagunapools.app.clients.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FetchAttendancesRequestDTO {
    private Integer pageKey;
    private Integer pageSize;
    private Long clientId;
}
