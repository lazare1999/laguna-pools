package com.lagunapools.lagunapools.app.admin.models;


import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by Lazo on 9/24/24
 */

@Getter
@Setter
@NoArgsConstructor
public class UsersResponseModel {
    private Long total;
    private List<UserResponseModel> content;

    public UsersResponseModel(Long total, List<UsersDomain> users) {
        this.total = total;
        this.content = users.stream()
                .map(UserResponseModel::new)
                .collect(Collectors.toList());
    }
}
