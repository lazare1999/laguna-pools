package com.lagunapools.lagunapools.app.user.domains;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Created by Lazo on 9/19/24
 */

@Setter
@Getter
@Entity
@NoArgsConstructor
@Table(schema = "users", name = "target_view")
public class TargetViewDomain {

    @Id
    @Column(name = "target_id")
    private Long targetId;

    @Column(name = "target_name")
    private String targetName;

    @Column(name = "target_description")
    private String targetDescription;

}


