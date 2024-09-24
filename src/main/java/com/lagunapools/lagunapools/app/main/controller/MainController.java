package com.lagunapools.lagunapools.app.main.controller;

import com.lagunapools.lagunapools.app.main.models.AuthenticationRequest;
import com.lagunapools.lagunapools.app.main.models.UserRolesResponse;
import com.lagunapools.lagunapools.app.main.service.MainService;
import com.lagunapools.lagunapools.common.interefaces.PreAuthorizeLagunaRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUserId;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

/**
 * Created by Lazo on 9/12/24
 */

@RestController
@RequiredArgsConstructor
public class MainController {

    private final MainService mainService;

    @PreAuthorizeLagunaRoles
    @GetMapping(value = "/get_current_user_id")
    public ResponseEntity<Integer> getCurrentUserId() {
        return okResponse(getCurrentApplicationUserId());
    }

    @PreAuthorizeLagunaRoles
    @GetMapping(value = "/get_user_name")
    public ResponseEntity<String> getUserName(@RequestHeader("Authorization") String token) {
        return mainService.getUserName(token);
    }

    @PreAuthorizeLagunaRoles
    @GetMapping(value = "/get_user_roles")
    public UserRolesResponse getUserRoles(@RequestHeader("Authorization") String token) {
        return mainService.getUserRoles(token);
    }


    @PreAuthorizeLagunaRoles
    @PostMapping(value = "/logout_from_system")
    public ResponseEntity<Boolean> logout(@RequestHeader("Authorization") String token) {
        return mainService.logout(token);
    }

    @PostMapping(value = "/authenticate")
    public ResponseEntity<?> createAuthenticationToken(AuthenticationRequest autRequest) throws Exception {
        return mainService.createAuthenticationToken(autRequest);
    }

    @PostMapping(value = "/jwt_via_refresh_token")
    public ResponseEntity<?> jwtViaRefreshToken(String refreshToken) {
        return mainService.jwtViaRefreshToken(refreshToken);
    }

    @GetMapping(value = "/health_check")
    public ResponseEntity<?> healthCheck() {
        return okResponse("Good Health Check\n");
    }

}
