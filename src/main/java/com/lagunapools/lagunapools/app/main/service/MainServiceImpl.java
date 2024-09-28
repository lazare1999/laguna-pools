package com.lagunapools.lagunapools.app.main.service;

import com.lagunapools.lagunapools.app.main.models.AuthenticationRequest;
import com.lagunapools.lagunapools.app.main.models.AuthenticationResponse;
import com.lagunapools.lagunapools.app.main.models.UserRolesResponse;
import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.domains.TargetDomain;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.app.user.repository.UsersRepository;
import com.lagunapools.lagunapools.app.user.services.MyUserDetailsService;
import com.lagunapools.lagunapools.services.RedisService;
import com.lagunapools.lagunapools.utils.JwtUtils;
import io.micrometer.common.util.StringUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

import static com.lagunapools.lagunapools.utils.EncryptUtils.verifyPassword;
import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUser;
import static com.lagunapools.lagunapools.utils.ResponseUtils.*;

/**
 * Created by Lazo on 9/12/24
 */

@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {

    private static final Logger logger = LoggerFactory.getLogger(MainServiceImpl.class);

    private final UserRepository userRepository;
    private final UsersRepository usersRepository;

    private final AuthenticationManager authenticateManager;

    private final JwtUtils jwtTokenUtils;

    private final MyUserDetailsService userDetailsService;
    private final RedisService redisService;

    @Override
    public ResponseEntity<String> getUserName(String token) {
        var userName = jwtTokenUtils.getUserNameViaToken(token);

        if (StringUtils.isEmpty(userName))
            return badRequestResponse("");

        return okResponse(userName);
    }

    @Override
    @Transactional
    public UserRolesResponse getUserRoles(String token) {
        var userName = jwtTokenUtils.getUserNameViaToken(token);
        AppUser user = userRepository.findByUsername(userName);

        List<String> roles = user.getTargetDomains().stream().map(TargetDomain::getTargetName).toList();
        return new UserRolesResponse(roles);
    }

    @Override
    public ResponseEntity<Boolean> logout() {
        var username = getCurrentApplicationUser().getUsername();

        if (username != null) {
            redisService.removeToken(username, true);
            redisService.removeToken(username, false);
        }

        return okResponse(true);
    }

    @Override
    @Transactional
    public ResponseEntity<?> createAuthenticationToken(AuthenticationRequest autRequest) throws Exception {
        if (StringUtils.isEmpty(autRequest.getUsername()) || StringUtils.isEmpty(autRequest.getPassword()))
            return badRequestResponse("1");

        var user = userRepository.findByUsername(autRequest.getUsername());
        if (user == null)
            return badRequestResponse("No User found with username " + autRequest.getUsername());

        var u = usersRepository.findByUserId(user.getUserId());

        if (u == null) {
            return badRequestResponse("2");
        }

        Integer maxLoginAttempts = 3;
        Authentication newUser = userDetailsService.authenticateJwt(maxLoginAttempts, u, verifyPassword(autRequest.getPassword(), user.getPassword()));
        if (newUser == null)
            return forbiddenResponse("Wrong password.");

        boolean userIsAdmin = u.getTargetDomains().stream()
                .anyMatch(r -> Objects.equals(r.getTargetName(), "ROLE_LAGUNA_ADMIN"));

        if (!userIsAdmin && (u.getIsLocked() || Objects.equals(maxLoginAttempts, u.getLoginAttempts()))) {
            return lockedResponse("User is locked. Contact Administrator.");
        } else {
            u.setLoginAttempts(0);
            usersRepository.save(u);
        }

        try {
            authenticateManager.authenticate(newUser);
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or" +
                    " password", e);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(autRequest.getUsername());

        final AuthenticationResponse jwt = jwtTokenUtils.generateToken(userDetails);

        return okResponse(jwt);
    }

    @Override
    public ResponseEntity<?> jwtViaRefreshToken(String refreshToken) {
        String userName = null;
        if (StringUtils.isNotEmpty(refreshToken)) {
            try {
                if (jwtTokenUtils.extractAccessTokenStatus(refreshToken))
                    return badRequestResponse("");
                userName = jwtTokenUtils.extractUsername(refreshToken);
            } catch (Exception e) {
                logger.error("An error occurred", e);
            }
        }

        if (userName == null)
            return badRequestResponse("");

        final UserDetails userDetails = userDetailsService.loadUserByUsername(userName);

        final AuthenticationResponse jwt = jwtTokenUtils.generateToken(userDetails);

        return okResponse(jwt);
    }

}
