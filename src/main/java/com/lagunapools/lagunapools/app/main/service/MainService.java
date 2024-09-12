package com.lagunapools.lagunapools.app.main.service;

import com.lagunapools.lagunapools.app.main.models.AuthenticationRequest;
import org.springframework.http.ResponseEntity;

/**
 * Created by Lazo on 9/12/24
 */

public interface MainService {

    ResponseEntity<Boolean> addRole(String token, Integer roleId);

    ResponseEntity<Boolean> addUser(String token, AuthenticationRequest request);

    ResponseEntity<String> getUserName(String token);

    ResponseEntity<Boolean> logout(String token);

    ResponseEntity<?> createAuthenticationToken(AuthenticationRequest autRequest) throws Exception;

    ResponseEntity<?> jwtViaRefreshToken(String refreshToken);

}
