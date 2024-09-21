package com.lagunapools.lagunapools.app.user.domains;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Lazo on 2024-09-11
 */

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "active_users")
@Builder
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
    private LocalDateTime lastAuthDate;

    @Column(name = "is_locked")
    private Boolean isLocked;

    @ManyToMany(cascade = CascadeType.DETACH)
    @JoinTable(
            schema = "users",
            name = "user_roles", // the join table name
            joinColumns = @JoinColumn(name = "user_id"), // foreign key for User
            inverseJoinColumns = @JoinColumn(name = "target_id") // foreign key for TargetViewDomain
    )
    private List<TargetDomain> targetDomains;


}
