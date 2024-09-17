package com.lagunapools.lagunapools.app.admin.models;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Created by Lazo on 9/17/24
 */

@Getter
@Setter
@NoArgsConstructor
public class AddRemoveRoleModel {
    private Integer roleId;
    private Long userId;
}
