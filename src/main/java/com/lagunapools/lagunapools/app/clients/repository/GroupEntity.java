package com.lagunapools.lagunapools.app.clients.repository;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(schema = "clients", name = "groups")
public class GroupEntity {
    @Id
    @SequenceGenerator(name = "groups_id_seq", sequenceName = "clients.groups_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "groups_id_seq")
    private Long id;

    private String groupName;
    private String dates;
    private String notes;
    private Integer maxAllowedNumberOfPeople;
    @OneToMany(cascade = CascadeType.DETACH)
    private List<ClientEntity> clients;

}
