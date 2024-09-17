package com.lagunapools.lagunapools.app.admin.models;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Lazo on 9/16/24
 */

@Getter
@Setter
@NoArgsConstructor
public class AddUserModel implements Serializable {
    private String username;
    private String password;
    private List<Integer> roles;
}
