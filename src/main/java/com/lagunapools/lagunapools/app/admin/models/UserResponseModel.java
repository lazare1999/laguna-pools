package com.lagunapools.lagunapools.app.admin.models;


import com.lagunapools.lagunapools.app.user.domains.TargetDomain;
import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Lazo on 9/24/24
 */

@Getter
@Setter
public class UserResponseModel {
    private Long userId;
    private String username;
    private LocalDateTime lastAuthDate;
    private Boolean isLocked;
    private Boolean inActiveUsers;
    private List<String> Roles;
    private List<Long> RolesIds;

    public UserResponseModel(UsersDomain user) {
        this.userId = user.getUserId();
        this.username = user.getUserName();
        this.lastAuthDate = user.getLastAuthDate();
        this.isLocked = user.getIsLocked();
        this.Roles = user.getTargetDomains().stream()
                .map(TargetDomain::getTargetDescription).toList();
        this.RolesIds = user.getTargetDomains().stream()
                .map(TargetDomain::getTargetId).toList();
    }
}
