package com.lagunapools.lagunapools.app.branches.repository;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * Created by Lazo on 9/26/24
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(schema = "branches", name = "branches")
public class BranchEntity implements Serializable {

    @Id
    @SequenceGenerator(name = "branches_id_seq", sequenceName = "branches.branches_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "branches_id_seq")
    private Long id;

    private String branchName;

    public BranchEntity(String branchName) {
        this.branchName = branchName;
    }
}
