package com.lagunapools.lagunapools.app.clients.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddAttendancesRequestDTO {
    private List<Long> clientIds;
    private LocalDateTime time;
    private boolean attended;
}
