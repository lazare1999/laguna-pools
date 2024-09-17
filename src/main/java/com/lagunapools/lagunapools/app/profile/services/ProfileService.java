package com.lagunapools.lagunapools.app.profile.services;

import com.lagunapools.lagunapools.app.main.models.ChangePasswordModel;
import org.springframework.http.ResponseEntity;

public interface ProfileService {
    ResponseEntity<?> changePassword(String token, ChangePasswordModel changePasswordModel);
}
