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
    private Long id;
    private String groupName;
    private String dates;
    private String notes;
    @OneToMany(cascade = CascadeType.DETACH)
    private List<ClientEntity> clients;

}
