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
        String passwordToHash = "123";
        String expectedHash = "40700b4f6fe3475335e59af7930b8ae78efc1910762bf8c3d777d13df2882e9fcf88f030e061b02c236d6e7492ce905312bb796bb0a10c7f4329c280a9694fde";

        // Act
        String actualHash = EncryptUtils.encrypt(SALT, passwordToHash);

        // Assert
        assertEquals(expectedHash, actualHash);
    }
}
