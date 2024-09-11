package com.lagunapools.lagunapools.app.user.domains;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Created by Lazo on 9/11/24
 */

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(schema = "users", name = "users")
public class UsersDomain {

    @Id
    @Column(name = "user_id")
    @SequenceGenerator(name = "users_user_id_seq", sequenceName = "users.users_user_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_user_id_seq")
    private Long userId;

    @Column(name = "user_name")
    private String lastName;

    @Column(name = "user_password")
    private String userPassword;

    @Column(name = "status_id")
    private Integer statusId;

    @Column(name = "add_date")
    private LocalDateTime add_date;

    @Column(name = "last_auth_date")
    private LocalDateTime last_auth_date;

}