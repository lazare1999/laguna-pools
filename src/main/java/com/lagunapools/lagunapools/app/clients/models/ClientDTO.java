package com.lagunapools.lagunapools.app.clients.models;


import com.lagunapools.lagunapools.app.clients.repository.ClientEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.joda.time.DateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private String firstName;
    private String lastName;
    private String age;
    private double cost;
    private String phoneNumber;
    private String idStatus;
    private DateTime expDate;
    private String doctorCheckStatus;
    private String notes;

    public ClientDTO(ClientEntity client) {
        this.firstName = client.getFirstName();
        this.lastName = client.getLastName();
        this.age = client.getAge();
        this.cost = client.getCost();
        this.phoneNumber = client.getPhoneNumber();
        this.idStatus = client.getIdStatus();
        this.expDate = client.getExpDate();
        this.doctorCheckStatus = client.getDoctorCheckStatus();
        this.notes = client.getNotes();
    }
}
