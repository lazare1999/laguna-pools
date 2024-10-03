package com.lagunapools.lagunapools.utils;


import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Created by Lazo on 10/1/24
 */

public class DecryptUtil {

    private static final String KEY = "1234567890123456";
    private static final String IV = "1234567890123456";

    public static String decrypt(String encryptedText) {
        try {

            byte[] encryptedBytes = Base64.getUrlDecoder().decode(encryptedText);

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            SecretKeySpec secretKeySpec = new SecretKeySpec(KEY.getBytes(StandardCharsets.UTF_8), "AES");
            IvParameterSpec ivParams = new IvParameterSpec(IV.getBytes(StandardCharsets.UTF_8));

            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParams);
            byte[] decrypted = cipher.doFinal(encryptedBytes);

            return new String(decrypted, StandardCharsets.UTF_8);

        } catch (Exception e) {
            return "";
        }
    }
}
