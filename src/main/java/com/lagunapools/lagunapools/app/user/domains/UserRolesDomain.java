package com.lagunapools.lagunapools.app.user.domains;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Created by Lazo on 9/16/24
 */

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(schema = "users", name = "user_roles")
public class UserRolesDomain {

    @Id
    @Column(name = "user_role_id")
    @SequenceGenerator(name = "user_roles_user_role_id_seq", sequenceName = "users.user_roles_user_role_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_roles_user_role_id_seq")
    private Long userRoleId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "target_id")
    private Integer targetId;

    @Column(name = "add_date")
    private LocalDateTime addDate;

    @Column(name = "status_id")
    private Integer statusId;

    public UserRolesDomain(Long userId, Integer targetId) {
        this.userId = userId;
        this.targetId = targetId;
        this.addDate = LocalDateTime.now();
        this.statusId = 0;
    }

}
