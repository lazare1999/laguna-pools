package com.lagunapools.lagunapools.app.admin.controller;


import com.lagunapools.lagunapools.app.admin.models.AddRemoveRoleModel;
import com.lagunapools.lagunapools.app.admin.services.AdminRolesService;
import com.lagunapools.lagunapools.app.user.domains.TargetViewDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by Lazo on 9/27/24
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("admin/roles")
@PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
public class AdminRolesController {

    private final AdminRolesService adminRolesService;

    @GetMapping({"/list_roles"})
    @Cacheable(value = "rolesList")
    public List<TargetViewDomain> listRoles() {
        return adminRolesService.listRoles();
    }

    @PostMapping({"/add_role"})
    public ResponseEntity<?> addRole(@RequestBody AddRemoveRoleModel rm) {
        return adminRolesService.addRole(rm);
    }

    @DeleteMapping({"/remove_role"})
    public ResponseEntity<?> removeRole(AddRemoveRoleModel rm) {
        return adminRolesService.removeRole(rm);
    }
}
