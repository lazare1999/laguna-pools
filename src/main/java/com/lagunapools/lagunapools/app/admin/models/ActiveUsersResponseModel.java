package com.lagunapools.lagunapools.app.admin.models;


import com.lagunapools.lagunapools.app.user.domains.AppUser;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Created by Lazo on 9/21/24
 */

@Getter
@Setter
@NoArgsConstructor
public class ActiveUsersResponseModel {
    private Long total;
    private List<AppUser> content;

    public ActiveUsersResponseModel(Long total, List<AppUser> content) {
        this.total = total;
        this.content = content;
    }
}
