package com.lagunapools.lagunapools.app.admin.controller;


import com.lagunapools.lagunapools.app.admin.models.*;
import com.lagunapools.lagunapools.app.admin.services.AdminRolesService;
import com.lagunapools.lagunapools.app.admin.services.AdminSearchService;
import com.lagunapools.lagunapools.app.admin.services.AdminService;
import com.lagunapools.lagunapools.app.user.domains.TargetViewDomain;
import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import com.lagunapools.lagunapools.common.models.ChangePasswordModel;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
//    @Cacheable(value = "activeUsersCache", key = "#model.toString()")
    public ActiveUsersResponseModel listActiveUsers(@ModelAttribute ActiveUsersSearchModel model) {
        return adminSearchService.listActiveUsers(model);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @GetMapping(value = "/all_users")
//    @Cacheable(value = "allUsersCache")
    public List<UsersDomain> listAllUsers(@ModelAttribute UsersSearchModel model) {
        return adminSearchService.listAllUsers(model);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @GetMapping(value = "/user_details")
    public ResponseEntity<UsersDomain> getUserDetails(@RequestParam Long userId) {
        return adminSearchService.getUserDetails(userId);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping({"/add_user"})
    public ResponseEntity<?> addUser(@RequestBody AddUserModel u) {
        return adminService.addUser(u);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping({"/add_users"})
    public ResponseEntity<?> addUsers(@RequestBody List<AddUserModel> users) {
        return adminService.addUsers(users);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @DeleteMapping(value = "/remove_user")
    public ResponseEntity<?> removeUser(@RequestParam Long userId) {
        return adminService.removeUser(userId);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @DeleteMapping(value = "/remove_users")
    public ResponseEntity<?> removeUsers(@RequestParam List<Long> userIds) {
        return adminService.removeUsers(userIds);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping(value = "/unlock_or_lock_user")
    public ResponseEntity<?> unlockOrLockUser(@RequestBody Long userId) {
        return adminService.unlockOrLockUser(userId);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping(value = "/change_user_password")
    public ResponseEntity<?> changeUserPassword(@RequestBody ChangePasswordModel changePasswordModel) {
        return adminService.changeUserPassword(changePasswordModel);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @GetMapping({"/list_roles"})
    @Cacheable(value = "rolesList")
    public List<TargetViewDomain> listRoles() {
        return adminRolesService.listRoles();
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping({"/add_role"})
    public ResponseEntity<?> addRole(@RequestBody AddRemoveRoleModel rm) {
        return adminRolesService.addRole(rm);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @DeleteMapping({"/remove_role"})
    public ResponseEntity<?> removeRole(AddRemoveRoleModel rm) {
        return adminRolesService.removeRole(rm);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping({"/edit_user"})
    public ResponseEntity<?> editUser(@RequestBody EditUserModel request) {
        return adminService.changeUserDetails(request);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @PostMapping({"/edit_users_list"})
    public ResponseEntity<?> editUsersList(@RequestBody EditUsersListModel request) {
        return adminService.changeUsersListDetails(request);
    }

}
