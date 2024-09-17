package com.lagunapools.lagunapools.app.admin.services;

import com.lagunapools.lagunapools.app.admin.models.AddRemoveRoleModel;
import org.springframework.http.ResponseEntity;

public interface AdminRolesService {

    ResponseEntity<?> addRole(AddRemoveRoleModel rm);

    ResponseEntity<?> removeRole(AddRemoveRoleModel rm);

}
