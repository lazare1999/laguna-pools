package com.lagunapools.lagunapools.app.admin.controller;


import com.lagunapools.lagunapools.app.admin.models.AddUserModel;
import com.lagunapools.lagunapools.app.admin.models.EditUserModel;
import com.lagunapools.lagunapools.app.admin.models.EditUsersListModel;
import com.lagunapools.lagunapools.app.admin.services.AdminService;
import com.lagunapools.lagunapools.common.models.ChangePasswordModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by Lazo on 9/16/24
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("admin/user")
@PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
public class AdminUserController {

    private final AdminService adminService;

    @PostMapping({"/add_user"})
    public ResponseEntity<?> addUser(@RequestBody AddUserModel u) {
        return adminService.addUser(u);
    }

    @PostMapping({"/add_users"})
    public ResponseEntity<?> addUsers(@RequestBody List<AddUserModel> users) {
        return adminService.addUsers(users);
    }

    @DeleteMapping(value = "/remove_user")
    public ResponseEntity<?> removeUser(@RequestParam Long userId) {
        return adminService.removeUser(userId);
    }

    @DeleteMapping(value = "/remove_users")
    public ResponseEntity<?> removeUsers(@RequestParam List<Long> userIds) {
        return adminService.removeUsers(userIds);
    }

    @PostMapping(value = "/unlock_or_lock_user")
    public ResponseEntity<?> unlockOrLockUser(@RequestParam Long userId) {
        return adminService.unlockOrLockUser(userId);
    }

    @PostMapping(value = "/disable_or_enable_user")
    public ResponseEntity<?> disableOrEnableUser(@RequestParam Long userId) {
        return adminService.disableOrEnableUser(userId);
    }

    @PostMapping(value = "/change_user_password")
    public ResponseEntity<?> changeUserPassword(@RequestBody ChangePasswordModel changePasswordModel) {
        return adminService.changeUserPassword(changePasswordModel);
    }

    @PostMapping({"/edit_user"})
    public ResponseEntity<?> editUser(@RequestBody EditUserModel request) {
        return adminService.changeUserDetails(request);
    }

    @PostMapping({"/edit_users_list"})
    public ResponseEntity<?> editUsersList(@RequestBody EditUsersListModel request) {
        return adminService.changeUsersListDetails(request);
    }

}
