package com.lagunapools.lagunapools.app.clients.models;


import com.lagunapools.lagunapools.app.clients.repository.ClientEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String age;
    private double cost;
    private String phoneNumber;
    private String idStatus;
    private LocalDateTime expDate;
    private String doctorCheckStatus;
    private String notes;
    private Long groupId;

    public ClientDTO(ClientEntity client) {
        this.id = client.getId();
        this.firstName = client.getFirstName();
        this.lastName = client.getLastName();
        this.age = client.getAge();
        this.cost = client.getCost();
        this.phoneNumber = client.getPhoneNumber();
        this.idStatus = client.getIdStatus();
        this.expDate = client.getExpDate();
        this.doctorCheckStatus = client.getDoctorCheckStatus();
        this.notes = client.getNotes();
        this.groupId = client.getGroup().getId();
    }
}
