package com.lagunapools.lagunapools.utils;


import com.lagunapools.lagunapools.app.main.models.AuthenticationResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Created by Lazo on 9/12/24
 */

@Service
public class JwtUtils {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    public static Long EXPIRES_IN_MILLIS = 300_000L;
    public static Long REFRESH_EXPIRES_IN_MILLIS = 60000*60L;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Boolean extractAccessTokenStatus(String token) {
        final Claims claims = extractAllClaims(token);
        return claims.get("access_token", Boolean.class);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY)))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public AuthenticationResponse generateToken(UserDetails userDetails) {
        Map<String, Object> accessTokenClaims = new HashMap<>();
        accessTokenClaims.put("access_token", true);

        Map<String, Object> refreshTokenClaims = new HashMap<>();
        refreshTokenClaims.put("access_token", false);

        return new AuthenticationResponse(createToken(accessTokenClaims, userDetails.getUsername()), System.currentTimeMillis() + EXPIRES_IN_MILLIS, createRefreshToken(refreshTokenClaims, userDetails.getUsername()), System.currentTimeMillis() + REFRESH_EXPIRES_IN_MILLIS);
    }

    private String createToken(Map<String, Object> claims, String subject) {
            return Jwts
                    .builder()
                    .claims(claims)
                    .subject(subject)
                    .issuedAt(new Date(System.currentTimeMillis()))
                    .expiration(new Date(System.currentTimeMillis() + EXPIRES_IN_MILLIS))
                    .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY)), Jwts.SIG.HS512)
                    .compact();

    }

    private String createRefreshToken(Map<String, Object> claims, String subject) {
        return Jwts
                .builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRES_IN_MILLIS))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY)), Jwts.SIG.HS512)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        if (userDetails == null)
            return false;
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String getUserNameViaToken(String token) {

        if (StringUtils.isEmpty(token))
            return null;

        var userName = extractUsername(token.substring(7));

        if (StringUtils.isEmpty(userName))
            return null;

        return userName;
    }

}
