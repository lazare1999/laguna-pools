package com.lagunapools.lagunapools.app.admin.controller;


import com.lagunapools.lagunapools.app.admin.models.ActiveUsersSearchModel;
import com.lagunapools.lagunapools.app.admin.models.AddRemoveRoleModel;
import com.lagunapools.lagunapools.app.admin.models.AddUserModel;
import com.lagunapools.lagunapools.app.admin.models.UsersSearchModel;
import com.lagunapools.lagunapools.app.admin.services.AdminRolesService;
import com.lagunapools.lagunapools.app.admin.services.AdminSearchService;
import com.lagunapools.lagunapools.app.admin.services.AdminService;
import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import com.lagunapools.lagunapools.common.models.ChangePasswordModel;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Lazo on 9/16/24
 */

@RestController
@RequestMapping("admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AdminSearchService adminSearchService;
    private final AdminRolesService adminRolesService;

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @GetMapping(value = "/active_users")
    @Cacheable(value = "activeUsersCache")
    public List<AppUser> listActiveUsers(ActiveUsersSearchModel model) {
        return adminSearchService.listActiveUsers(model);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @GetMapping(value = "/all_users")
    @Cacheable(value = "allUsersCache")
    public List<UsersDomain> listAllUsers(UsersSearchModel model) {
        return adminSearchService.listAllUsers(model);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @GetMapping(value = "/user_details")
    public ResponseEntity<UsersDomain> getUserDetails(Long userId) {
        return adminSearchService.getUserDetails(userId);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping({"/add_user"})
    public ResponseEntity<?> addUser(AddUserModel u) {
        return adminService.addUser(u);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping({"/add_users"})
    public ResponseEntity<?> addUsers(List<AddUserModel> users) {
        return adminService.addUsers(users);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping(value = "/remove_user")
    public ResponseEntity<?> removeUser(Long userId) {
        return adminService.removeUser(userId);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping(value = "/remove_users")
    public ResponseEntity<?> removeUsers(List<Long> userIds) {
        return adminService.removeUsers(userIds);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping(value = "/unlock_or_lock_user")
    public ResponseEntity<?> unlockOrLockUser(Long userId) {
        return adminService.unlockOrLockUser(userId);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping(value = "/change_user_password")
    public ResponseEntity<?> changeUserPassword(ChangePasswordModel changePasswordModel) {
        return adminService.changeUserPassword(changePasswordModel);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping({"/add_role"})
    public ResponseEntity<?> addRole(AddRemoveRoleModel rm) {
        return adminRolesService.addRole(rm);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping({"/remove_role"})
    public ResponseEntity<?> removeRole(AddRemoveRoleModel rm) {
        return adminRolesService.removeRole(rm);
    }

}
