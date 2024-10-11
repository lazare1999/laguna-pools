package com.lagunapools.lagunapools.app.accounting.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Created by Lazo on 10/12/24
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendancesStatsRequestDTO {
    private LocalDateTime dayFrom;
    private LocalDateTime dayTo;
}
