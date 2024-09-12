package com.lagunapools.lagunapools.app.main.models;

import java.io.Serializable;

/**
 * Created by Lazo on 9/12/24
 */

public record AuthenticationResponse(String jwt, Long expiresIn, String refreshToken,
                                     Long refreshExpiresIn) implements Serializable {

    public AuthenticationResponse(String jwt, Long expiresIn, String refreshToken, Long refreshExpiresIn) {
        this.jwt = jwt;
        this.expiresIn = expiresIn - 5000;
        this.refreshToken = refreshToken;
        this.refreshExpiresIn = refreshExpiresIn;
    }
}
