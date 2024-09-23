package com.lagunapools.lagunapools.utils;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Created by Lazo on 9/16/24
 */

@SpringBootTest
@ActiveProfiles("test")
public class EncryptUtilsTest {

    @Value("${salt}")
    private String SALT;

    @Test
    public void testEncrypt() {
        String passwordToHash = "AAaaa11_";
        String expectedHash = "1e56417be93117b4144e561abd7aef8717f97efe4e367d03e9cd5ae4776877e60c2bd9a3d1f6688f5cc6d2d09a70fac89b44f2f25ffd9997a6808d1d9d2cae41";

        // Act
        String actualHash = EncryptUtils.encrypt(SALT, passwordToHash);

        // Assert
        assertEquals(expectedHash, actualHash);
    }

}
