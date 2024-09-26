package com.lagunapools.lagunapools.app.admin.models;


import com.lagunapools.lagunapools.app.branches.repository.BranchEntity;
import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.domains.TargetDomain;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Lazo on 9/21/24
 */

@Getter
@Setter
public class ActiveUserResponseModel {
    private Long userId;
    private String username;
    private LocalDateTime lastAuthDate;
    private Boolean isLocked;
    private List<String> Roles;
    private List<Long> RolesIds;
    private BranchEntity branch;

    public ActiveUserResponseModel(AppUser appUser) {
        this.userId = appUser.getUserId();
        this.username = appUser.getUsername();
        this.lastAuthDate = appUser.getLastAuthDate();
        this.isLocked = appUser.getIsLocked();
        this.Roles = appUser.getTargetDomains().stream()
                .map(TargetDomain::getTargetDescription).toList();
        this.RolesIds = appUser.getTargetDomains().stream()
                .map(TargetDomain::getTargetId).toList();
        this.branch = appUser.getBranch();
    }
}
