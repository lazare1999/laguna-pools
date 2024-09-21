package com.lagunapools.lagunapools.app.admin.models;


import com.lagunapools.lagunapools.app.user.domains.AppUser;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

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

    public ActiveUserResponseModel(AppUser appUser) {
        this.userId = appUser.getUserId();
        this.username = appUser.getUsername();
        this.lastAuthDate = appUser.getLastAuthDate();
        this.isLocked = appUser.getIsLocked();
    }
}
