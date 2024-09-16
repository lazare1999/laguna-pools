package com.lagunapools.lagunapools.app.main.models;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Created by Lazo on 9/16/24
 */

@Getter
@Setter
@NoArgsConstructor
public class ChangePasswordModel {
    private Long userId;
    private String oldPassword;
    private String newPassword;
}
