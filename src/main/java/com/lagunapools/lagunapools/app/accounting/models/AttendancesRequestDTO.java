package com.lagunapools.lagunapools.app.accounting.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Lazo on 10/10/24
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendancesRequestDTO {
    private Integer pageKey;
    private Integer pageSize;
    private List<String> branches;
    private String name;
    private String lastname;
    private LocalDateTime dayTo;
    private LocalDateTime dayFrom;
    private String type;
}
