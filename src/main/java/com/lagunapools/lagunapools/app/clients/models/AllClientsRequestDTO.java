package com.lagunapools.lagunapools.app.clients.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AllClientsRequestDTO implements Serializable {
    private Integer pageKey;
    private Integer pageSize;
    private List<String> branches;
    private String name;
    private String lastName;
    private String phone;
    private String type;
    private LocalDate birthDayFrom;
    private LocalDate birthDayTo;
    private LocalDate expDayFrom;
    private LocalDate expDayTo;
    private LocalDate docDayFrom;
    private LocalDate docDayTo;
    private Boolean idStatus;
    private Boolean contractStatus;
    private Double costFrom;
    private Double costTo;
    private String notes;
    private String day;
    private String hour;
}
