package com.lagunapools.lagunapools.app.clients.repository;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(schema = "clients", name = "groups")
public class GroupEntity {

    @Id
    @SequenceGenerator(name = "groups_id_seq", sequenceName = "clients.groups_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "groups_id_seq")
    private Long id;

    private String day;
    private String hour;

    @ManyToMany(targetEntity = ClientsEntity.class, cascade = CascadeType.DETACH)
    private List<ClientsEntity> clients;

    public GroupEntity(String day, String hour) {
        this.day = day;
        this.hour = hour;
    }
}
