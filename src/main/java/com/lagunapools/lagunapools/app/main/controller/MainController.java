package com.lagunapools.lagunapools.app.main.controller;

import com.lagunapools.lagunapools.app.main.models.AuthenticationRequest;
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

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @RequestMapping({"/add_role"})
    public ResponseEntity<Boolean> addRole(@RequestHeader("Authorization") String token, Integer roleId) {
        return mainService.addRole(token, roleId);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
    @RequestMapping({"/add_user"})
    public ResponseEntity<Boolean> addUser(@RequestHeader("Authorization") String token,
                                           AuthenticationRequest request) {
        return mainService.addUser(token, request);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA')")
    @RequestMapping({"/get_current_user_id"})
    public ResponseEntity<Integer> getCurrentUserId() {
        return new ResponseEntity<>(getCurrentApplicationUserId(), new HttpHeaders(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA')")
    @RequestMapping({"/get_user_name"})
    public ResponseEntity<String> getUserName(@RequestHeader("Authorization") String token) {
        return mainService.getUserName(token);
    }

    @PreAuthorize("hasRole('ROLE_LAGUNA')")
    @RequestMapping({"/logout_from_system"})
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

}
