package com.lagunapools.lagunapools.app.main.controller;

import com.lagunapools.lagunapools.app.main.models.AuthenticationRequest;
import com.lagunapools.lagunapools.app.main.models.ChangePasswordModel;
import com.lagunapools.lagunapools.app.main.service.MainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUserId;

/**
 * Created by Lazo on 9/12/24
 */

@RestController
@RequiredArgsConstructor
public class MainController {

    private final MainService mainService;

    @PreAuthorize("hasRole('ROLE_LAGUNA')")
    @RequestMapping(value = "/get_current_user_id", method = RequestMethod.GET)
    public ResponseEntity<Integer> getCurrentUserId() {
        return new ResponseEntity<>(getCurrentApplicationUserId(), new HttpHeaders(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA')")
    @RequestMapping(value = "/get_user_name", method = RequestMethod.GET)
    public ResponseEntity<String> getUserName(@RequestHeader("Authorization") String token) {
        return mainService.getUserName(token);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA')")
    @RequestMapping(value = "/logout_from_system", method = RequestMethod.POST)
    public ResponseEntity<Boolean> logout(@RequestHeader("Authorization") String token) {
        return mainService.logout(token);
    }

    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public ResponseEntity<?> createAuthenticationToken(AuthenticationRequest autRequest) throws Exception {
        return mainService.createAuthenticationToken(autRequest);
    }

    @RequestMapping(value = "/jwt_via_refresh_token", method = RequestMethod.POST)
    public ResponseEntity<?> jwtViaRefreshToken(String refreshToken) {
        return mainService.jwtViaRefreshToken(refreshToken);
    }

    @RequestMapping(value = "/health_check", method = RequestMethod.GET)
    public ResponseEntity<?> healthCheck() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA')")
    @RequestMapping(value = "/change_password", method = RequestMethod.POST)
    public ResponseEntity<Boolean> changePassword(@RequestHeader("Authorization") String token, ChangePasswordModel changePasswordModel) {
        return mainService.changePassword(token, changePasswordModel);
    }
}
