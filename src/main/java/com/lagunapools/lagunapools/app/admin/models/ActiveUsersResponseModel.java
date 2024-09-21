package com.lagunapools.lagunapools.app.admin.models;


import com.lagunapools.lagunapools.app.user.domains.AppUser;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by Lazo on 9/21/24
 */

@Getter
@Setter
@NoArgsConstructor
public class ActiveUsersResponseModel {
    private Long total;
    private List<ActiveUserResponseModel> content;

    public ActiveUsersResponseModel(Long total, List<AppUser> appUsers) {
        this.total = total;
        this.content = appUsers.stream()
                .map(ActiveUserResponseModel::new)
                .collect(Collectors.toList());
    }
}
