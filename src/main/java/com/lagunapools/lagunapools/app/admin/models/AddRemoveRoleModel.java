package com.lagunapools.lagunapools.app.admin.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Created by Lazo on 9/17/24
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddRemoveRoleModel {
    private Long roleId;
    private Long userId;

    @Override
    public String toString() {
        return super.toString();
    }

}
