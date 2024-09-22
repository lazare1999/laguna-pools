package com.lagunapools.lagunapools.app.clients.repository;

import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.joda.time.DateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(schema = "clients", name = "clients")
public class ClientEntity {
    @Id
    private Long id;

    private String firstName;
    private String lastName;
    private String age;
    private double cost;
    private String phoneNumber;
    private String idStatus;
    private DateTime expDate;
    private String doctorCheckStatus;
    private String notes;

    public ClientEntity(ClientDTO client) {
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
