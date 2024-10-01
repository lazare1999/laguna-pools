package com.lagunapools.lagunapools.app.main.models;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * Created by Lazo on 9/12/24
 */

@Getter
@Setter
@NoArgsConstructor
public class AuthenticationRequest implements Serializable {

    private String encryptedUsername;
    private String encryptedPassword;

}
