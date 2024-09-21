package com.lagunapools.lagunapools.app.user.domains;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

/**
 * Created by Lazo on 9/21/24
 */

@Entity(name = "targets")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Table(schema = "users", name = "targets")
public class TargetDomain {

    @Id
    @Column(name = "target_id")
    private Long targetId;

    @Column(name = "target_name")
    private String targetName;

    @Column(name = "target_description")
    private String targetDescription;

    @Column(name = "app_id")
    private Integer appId;

    @Column(name = "order_by")
    private Integer orderBy;

    @Column(name = "group_by")
    private String groupBy;

    @ManyToMany(targetEntity = UsersDomain.class, cascade = CascadeType.DETACH)
    private List<UsersDomain> usersDomains;

    @ManyToMany(targetEntity = UsersDomain.class, cascade = CascadeType.DETACH)
    private List<AppUser> appUser;

}
