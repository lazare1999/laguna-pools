package com.lagunapools.lagunapools.app.admin.services;

import com.lagunapools.lagunapools.app.admin.models.AddRemoveRoleModel;
import com.lagunapools.lagunapools.app.user.domains.TargetViewDomain;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AdminRolesService {

    List<TargetViewDomain> listRoles();

    ResponseEntity<?> addRole(AddRemoveRoleModel rm);

    ResponseEntity<?> removeRole(AddRemoveRoleModel rm);

}
