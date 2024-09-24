package com.lagunapools.lagunapools.app.clients.repository;

import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(schema = "clients", name = "clients")
public class ClientEntity {

    @Id
    @SequenceGenerator(name = "clients_id_seq", sequenceName = "clients.clients_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "clients_id_seq")
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

    @ManyToOne(cascade = CascadeType.DETACH)
    private GroupEntity group;

    public ClientEntity(ClientDTO client) {
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
    }
}
