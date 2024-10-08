package com.lagunapools.lagunapools.app.main.service;

import com.lagunapools.lagunapools.app.main.models.AuthenticationRequest;
import com.lagunapools.lagunapools.app.main.models.UserRolesResponse;
import org.springframework.http.ResponseEntity;

/**
 * Created by Lazo on 9/12/24
 */

public interface MainService {

    ResponseEntity<String> getUserName(String token);

    UserRolesResponse getUserRoles(String token);

    ResponseEntity<Boolean> logout();

    ResponseEntity<?> createAuthenticationToken(AuthenticationRequest autRequest) throws Exception;

    ResponseEntity<?> jwtViaRefreshToken(String refreshToken);

}
