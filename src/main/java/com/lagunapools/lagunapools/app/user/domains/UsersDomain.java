package com.lagunapools.lagunapools.app.user.domains;

import com.lagunapools.lagunapools.app.branches.repository.BranchEntity;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Lazo on 9/11/24
 */

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "users")
@Builder
//@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Table(schema = "users", name = "users")
public class UsersDomain implements Serializable {

    @Serial
    private static final long serialVersionUID = 2L;

    @Id
    @Column(name = "user_id")
    @SequenceGenerator(name = "users_user_id_seq", sequenceName = "users.users_user_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_user_id_seq")
    private Long userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_password")
    private String userPassword;

    @Column(name = "status_id")
    private Integer statusId;

    @Column(name = "login_attempts")
    private Integer loginAttempts;

    @Column(name = "is_locked")
    private Boolean isLocked;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "last_login_ip")
    private String lastLoginIp;

    @Column(name = "add_date")
    private LocalDateTime addDate;

    @Column(name = "last_auth_date")
    private LocalDateTime lastAuthDate;

    @Column(name = "branch_id", insertable = false, updatable = false)
    private Integer branchId;

    @ManyToMany(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JoinTable(
            schema = "users",
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "target_id")
    )
    private List<TargetDomain> targetDomains;

    @ManyToOne
    @JoinColumn(name = "branch_id", referencedColumnName = "id")
    private BranchEntity branch;

    public UsersDomain(String userName, String userPassword, String createdBy, String updatedBy) {
        this.userName = userName;
        this.userPassword = userPassword;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.addDate = LocalDateTime.now();
        this.statusId = 0;
        this.loginAttempts = 0;
        this.isLocked = false;
        this.lastAuthDate = LocalDateTime.now();
    }

}