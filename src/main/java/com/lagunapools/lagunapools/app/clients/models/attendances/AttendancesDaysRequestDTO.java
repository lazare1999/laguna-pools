package com.lagunapools.lagunapools.app.clients.models.attendances;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Created by Lazo on 10/3/24
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendancesDaysRequestDTO {
    private Integer pageKey;
    private Integer pageSize;
    private LocalDate selectedDay;
    private LocalTime selectedTime;
    private Boolean attended;
    private List<String> branches;
}
