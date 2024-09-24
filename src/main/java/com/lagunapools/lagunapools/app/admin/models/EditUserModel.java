package com.lagunapools.lagunapools.app.admin.models;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class EditUserModel {
    private Long userId;
    private String newUsername;
    private String newPassword;
    private List<String> newRoles;
}
