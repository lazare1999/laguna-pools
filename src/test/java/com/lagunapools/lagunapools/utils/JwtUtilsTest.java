package com.lagunapools.lagunapools.utils;

import com.lagunapools.lagunapools.app.main.models.AuthenticationResponse;
import com.lagunapools.lagunapools.services.RedisService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;


/**
 * Created by Lazo on 9/16/24
 */

@SpringBootTest
@ActiveProfiles("test")
public class JwtUtilsTest {

    @Autowired
    private RedisService redisService;

    @Value("${jwt.secret}")
    private String JWT_SECRET_KEY;

    private JwtUtils jwtUtils;
    private final String USER_NAME = "test-admin";

    @BeforeEach
    public void setup() {
        if (JWT_SECRET_KEY == null || JWT_SECRET_KEY.isEmpty()) {
            throw new IllegalStateException("JWT_SECRET_KEY must not be null or empty");
        }
        jwtUtils = new JwtUtils(redisService, JWT_SECRET_KEY);
    }

    @Test
    public void testExtractUsername() {
        String token = generateToken();

        String username = jwtUtils.extractUsername(token);

        assertEquals(USER_NAME, username);
    }

    @Test
    public void testExtractExpiration() {
        String token = generateToken();

        Date expiration = jwtUtils.extractExpiration(token);

        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }

    @Test
    public void testExtractAccessTokenStatus() {
        String token = generateToken();

        Boolean status = jwtUtils.extractAccessTokenStatus(token);

        assertTrue(status);
    }

    @Test
    public void testIsTokenExpired() {
        String token = generateToken();

        Boolean expired = jwtUtils.isTokenExpired(token);

        assertFalse(expired);
    }

    @Test
    public void testGenerateToken() {
        UserDetails userDetails = User.withUsername(USER_NAME).password("password").roles("USER").build();
        AuthenticationResponse response = jwtUtils.generateToken(userDetails);

        assertNotNull(response);
        assertNotNull(response.jwt());
        assertNotNull(response.refreshToken());
        assertTrue(response.expiresIn() > System.currentTimeMillis());
        assertTrue(response.refreshExpiresIn() > System.currentTimeMillis());
    }

    @Test
    public void testValidateToken() {
        UserDetails userDetails = User.withUsername(USER_NAME).password("password").roles("USER").build();
        String token = generateToken();

        Boolean valid = jwtUtils.validateToken(token, userDetails);

        assertTrue(valid);
    }

    @Test
    public void testGetUserNameViaToken() {
        String token = generateToken();

        String username = jwtUtils.getUserNameViaToken("Bearer " + token);

        redisService.storeToken(USER_NAME, generateToken(), true);

        assertEquals(USER_NAME, username);
    }

    private String generateToken() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("access_token", true);

        return Jwts
                .builder()
                .claims(claims)
                .subject(USER_NAME)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + JwtUtils.EXPIRES_IN_MILLIS))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(JWT_SECRET_KEY)), Jwts.SIG.HS512)
                .compact();
    }
}
