package com.lagunapools.lagunapools.app.profile.controller;


import com.lagunapools.lagunapools.app.main.models.ChangePasswordModel;
import com.lagunapools.lagunapools.app.profile.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Lazo on 9/16/24
 */

@RestController
@RequestMapping("profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PreAuthorize("hasAnyRole('ROLE_LAGUNA_ADMIN', 'ROLE_LAGUNA_CHANGE_PASSWORD')")
    @PostMapping(value = "/change_password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token, ChangePasswordModel changePasswordModel) {
        return profileService.changePassword(token, changePasswordModel);
    }

}
