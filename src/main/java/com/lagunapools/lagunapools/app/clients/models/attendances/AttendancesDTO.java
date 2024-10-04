package com.lagunapools.lagunapools.app.clients.models.attendances;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendancesDTO {
    private Long total;
    private List<AttendanceDTO> attendances;
}
