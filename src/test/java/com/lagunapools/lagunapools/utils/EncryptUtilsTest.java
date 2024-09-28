package com.lagunapools.lagunapools.utils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Created by Lazo on 9/28/24
 */

class EncryptUtilsTest {

    private String password;

    @BeforeEach
    void setUp() {
        // Setup a sample password to use in tests
        password = "123";
    }

    @Test
    void testGenerateSalt() {
        String salt1 = EncryptUtils.generateSalt();
        String salt2 = EncryptUtils.generateSalt();

        assertNotNull(salt1);
        assertNotNull(salt2);
        assertNotEquals(salt1, salt2, "Salts should be unique"); // Ensure generated salts are not the same
        assertEquals(24, salt1.length(), "Encoded salt should be 24 characters long");
    }

    @Test
    void testHashPassword() throws NoSuchAlgorithmException, InvalidKeySpecException {
        String salt = EncryptUtils.generateSalt();
        String hashedPassword = EncryptUtils.hashPassword(password, salt);

        assertNotNull(hashedPassword);
        assertFalse(hashedPassword.isEmpty(), "Hashed password should not be empty");
    }

    @Test
    void testCreateSaltedHash() throws NoSuchAlgorithmException, InvalidKeySpecException {
        String saltedHash = EncryptUtils.createSaltedHash(password);

        assertNotNull(saltedHash);
        assertTrue(saltedHash.contains(":"), "Salted hash should contain a ':' delimiter between salt and hash");
    }

    @Test
    void testVerifyPassword() throws NoSuchAlgorithmException, InvalidKeySpecException {
        String saltedHash = EncryptUtils.createSaltedHash(password);

        boolean isVerified = EncryptUtils.verifyPassword(password, saltedHash);
        assertTrue(isVerified, "Password should be correctly verified");

        // Test with incorrect password
        boolean isWrongPasswordVerified = EncryptUtils.verifyPassword("wrongPassword", saltedHash);
        assertFalse(isWrongPasswordVerified, "Verification should fail for incorrect password");
    }

    @Test
    void testVerifyPasswordWithInvalidHash() {
        String invalidStoredHash = "invalidHashFormat";

        assertThrows(ArrayIndexOutOfBoundsException.class, () -> {
            EncryptUtils.verifyPassword(password, invalidStoredHash);
        }, "Invalid hash format should throw ArrayIndexOutOfBoundsException");
    }
}
