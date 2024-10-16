package com.lagunapools.lagunapools.app.clients.models;


import com.lagunapools.lagunapools.app.clients.models.groups.GroupDTO;
import com.lagunapools.lagunapools.app.clients.models.groups.GroupMapper;
import com.lagunapools.lagunapools.app.clients.repository.ClientsEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate age;
    private Double debt;
    private LocalDate expDate;
    private LocalDate doctorCheckTill;
    private String phoneNumber;
    private Boolean idStatus;
    private Boolean contractStatus;
    private String notes;
    private String type;
    private List<GroupDTO> groups;

    public ClientDTO(ClientsEntity client) {
        this.id = client.getId();
        this.firstName = client.getFirstName();
        this.lastName = client.getLastName();
        this.age = client.getAge();
        this.debt = client.getDebt();
        this.expDate = client.getExpDate();
        this.doctorCheckTill = client.getDoctorCheckTill();
        this.phoneNumber = client.getPhoneNumber();
        this.idStatus = client.getIdStatus();
        this.contractStatus = client.getContractStatus();
        this.notes = client.getNotes();
        this.type = client.getType();
        this.groups = GroupMapper.toDTOs(client.getGroups());
    }
}
