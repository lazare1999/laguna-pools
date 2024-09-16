package com.lagunapools.lagunapools.app.user.domains;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    private Long userRoleId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "target_id")
    private Integer targetId;

    @Column(name = "add_date")
    private LocalDateTime addDate;

    @Column(name = "status_id")
    private Integer statusId;

}
