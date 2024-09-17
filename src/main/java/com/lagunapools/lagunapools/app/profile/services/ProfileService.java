package com.lagunapools.lagunapools.app.profile.services;

import com.lagunapools.lagunapools.common.models.ChangePasswordModel;
import org.springframework.http.ResponseEntity;

public interface ProfileService {
    ResponseEntity<?> changePassword(ChangePasswordModel changePasswordModel);
}
