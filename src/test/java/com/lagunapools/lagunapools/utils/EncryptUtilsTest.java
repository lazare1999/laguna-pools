package com.lagunapools.lagunapools.utils;


import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Created by Lazo on 9/16/24
 */

public class EncryptUtilsTest {
    @Test
    public void testEncrypt() {
        // Arrange
        String salt = "somesalt";
        String passwordToHash = "123";
        String expectedHash = "d74987729ee0d7f4aac61ddcaff5c43a897aa2cd97a9473c83dfd3bc9be2828f969c8e38ed3893d4029d276c171148e4289638413e7ed46ffde2211062189c92";

        // Act
        String actualHash = EncryptUtils.encrypt(salt, passwordToHash);

        // Assert
        assertEquals(expectedHash, actualHash);
    }
}
