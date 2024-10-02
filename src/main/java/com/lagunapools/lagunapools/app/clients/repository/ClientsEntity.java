package com.lagunapools.lagunapools.app.clients.repository;

import com.lagunapools.lagunapools.app.branches.repository.BranchEntity;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import com.lagunapools.lagunapools.app.clients.models.groups.GroupMapper;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(schema = "clients", name = "clients")
public class ClientsEntity {

    @Id
    @SequenceGenerator(name = "clients_id_seq", sequenceName = "clients.clients_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "clients_id_seq")
    private Long id;

    private String firstName;
    private String lastName;
    private LocalDate age;
    private Double cost;
    private LocalDate expDate;
    private LocalDate doctorCheckTill;
    private String phoneNumber;
    private Boolean idStatus;
    private Boolean contractStatus;
    private String notes;
    private String parent;
    private String createdBy;
    private String updatedBy;

    @Column(name = "branch_id", insertable = false, updatable = false)
    private Integer branchId;

    @ManyToMany(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JoinTable(
            schema = "clients",
            name = "client_groups",
            joinColumns = @JoinColumn(name = "client_id"),
            inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    private List<GroupEntity> groups;

    @ManyToOne
    @JoinColumn(name = "branch_id", referencedColumnName = "id")
    private BranchEntity branch;

    public ClientsEntity(ClientDTO client, String username) {
        this.id = client.getId();
        this.firstName = client.getFirstName();
        this.lastName = client.getLastName();
        this.age = client.getAge();
        this.cost = client.getCost() == null ? 0.0 : client.getCost();
        this.expDate = client.getExpDate();
        this.doctorCheckTill = client.getDoctorCheckTill();
        this.phoneNumber = client.getPhoneNumber();
        this.idStatus = client.getIdStatus();
        this.contractStatus = client.getContractStatus();
        this.notes = client.getNotes();
        this.parent = client.getParent();
        this.createdBy = username;
        this.updatedBy = username;
        this.groups = GroupMapper.toEntities(client.getGroups());
    }
}
