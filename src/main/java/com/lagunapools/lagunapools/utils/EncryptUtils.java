package com.lagunapools.lagunapools.utils;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

/**
 * Created by Lazo on 9/11/24
 */

public class EncryptUtils {
    private static final int ITERATIONS = 10000;
    private static final int KEY_LENGTH = 512;
    private static final int SALT_LENGTH = 16;

    public static String generateSalt() {
        byte[] salt = new byte[SALT_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    public static String hashPassword(String password, String salt) throws NoSuchAlgorithmException, InvalidKeySpecException {
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt.getBytes(StandardCharsets.UTF_8), ITERATIONS, KEY_LENGTH);
        SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512");
        byte[] hashedBytes = keyFactory.generateSecret(spec).getEncoded();
        return Base64.getEncoder().encodeToString(hashedBytes);
    }

    public static boolean verifyPassword(String enteredPassword, String storedSaltedHash)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        String[] parts = storedSaltedHash.split(":");
        String storedSalt = parts[0];
        String storedHash = parts[1];

        String hashedEnteredPassword = hashPassword(enteredPassword, storedSalt);
        return hashedEnteredPassword.equals(storedHash);
    }

    public static String createSaltedHash(String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
        String salt = generateSalt();
        String hashedPassword = hashPassword(password, salt);
        return salt + ":" + hashedPassword;
    }
}
