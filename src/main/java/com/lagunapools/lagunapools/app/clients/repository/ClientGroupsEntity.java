package com.lagunapools.lagunapools.app.clients.repository;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Created by Lazo on 9/25/24
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(schema = "clients", name = "client_groups")
public class ClientGroupsEntity {

    @Id
    private Long id;

    @Column(name = "client_id")
    private Long clientId;

    @Column(name = "group_id")
    private Long groupId;

}
