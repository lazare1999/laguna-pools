package com.lagunapools.lagunapools.app.admin.services;

import com.lagunapools.lagunapools.app.admin.models.AddUserModel;
import com.lagunapools.lagunapools.common.models.ChangePasswordModel;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AdminService {

    ResponseEntity<?> addUser(AddUserModel u);

    ResponseEntity<?> addUsers(List<AddUserModel> users);

    ResponseEntity<?> removeUser(Long userId);

    ResponseEntity<?> removeUsers(List<Long> userIds);

    ResponseEntity<?> unlockOrLockUser(Long userId);

    ResponseEntity<?> changeUserPassword(ChangePasswordModel changePasswordModel);

}
