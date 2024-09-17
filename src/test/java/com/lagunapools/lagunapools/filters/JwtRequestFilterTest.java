package com.lagunapools.lagunapools.filters;

import com.lagunapools.lagunapools.app.user.services.MyUserDetailsService;
import com.lagunapools.lagunapools.utils.JwtUtils;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Created by Lazo on 9/16/24
 */

@SpringBootTest
@ActiveProfiles("test")
public class JwtRequestFilterTest {

    @Value("${jwt.secret}")
    private String JWT_SECRET_KEY;

    @Mock
    private MyUserDetailsService userDetailsService;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private JwtRequestFilter jwtRequestFilter;

    private String validJwtToken;
    private final String USER_NAME = "admin_user";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(mock(SecurityContext.class));

        if (JWT_SECRET_KEY == null || JWT_SECRET_KEY.isEmpty()) {
            throw new IllegalStateException("JWT_SECRET_KEY must not be null or empty");
        }

        // Generate a token for use in tests
        validJwtToken = generateToken();
    }

    @Test
    void doFilterInternal_validToken_setsAuthentication() throws Exception {
        // Arrange
        UserDetails userDetails = mock(UserDetails.class);
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + validJwtToken);
        when(jwtUtils.extractAccessTokenStatus(anyString())).thenReturn(true);
        when(jwtUtils.extractUsername(anyString())).thenReturn(USER_NAME);
        when(jwtUtils.validateToken(anyString(), any(UserDetails.class))).thenReturn(true);
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(userDetails);

        // Act
        jwtRequestFilter.doFilterInternal(request, response, chain);
    }

    @Test
    void doFilterInternal_noAuthHeader_doesNotSetAuthentication() throws Exception {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        when(request.getHeader("Authorization")).thenReturn(null);

        // Act
        jwtRequestFilter.doFilterInternal(request, response, chain);

        assert SecurityContextHolder.getContext().getAuthentication() == null;
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
