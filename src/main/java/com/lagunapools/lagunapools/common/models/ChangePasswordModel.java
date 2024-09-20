package com.lagunapools.lagunapools.common.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Created by Lazo on 9/16/24
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordModel {
    private Long changePasswordCandidateUserId;
    private String oldPassword;
    private String newPassword;

    @Override
    public String toString() {
        return super.toString();
    }

}
