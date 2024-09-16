package com.lagunapools.lagunapools.app.user.domains;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

/**
 * Created by Lazo on 2024-09-11
 */

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(schema = "users", name = "active_users")
public class AppUser implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name")
    private String username;

    @Column(name = "user_password")
    private String password;

    @Column(name = "last_auth_date")
    private String lastAuthDate;
}
