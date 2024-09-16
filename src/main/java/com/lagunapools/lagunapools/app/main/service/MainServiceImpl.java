package com.lagunapools.lagunapools.app.main.service;

import com.lagunapools.lagunapools.app.main.models.AuthenticationRequest;
import com.lagunapools.lagunapools.app.main.models.AuthenticationResponse;
import com.lagunapools.lagunapools.app.main.models.ChangePasswordModel;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.app.user.repository.UsersRepository;
import com.lagunapools.lagunapools.app.user.services.MyUserDetailsService;
import com.lagunapools.lagunapools.utils.JwtUtils;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Objects;

import static com.lagunapools.lagunapools.utils.EncryptUtils.encrypt;

/**
 * Created by Lazo on 9/12/24
 */

@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {

    private static final Logger logger = LoggerFactory.getLogger(MainServiceImpl.class);

    HttpHeaders headers = new HttpHeaders();

    private final UserRepository userRepository;
    private final UsersRepository usersRepository;

    private final AuthenticationManager authenticateManager;

    private final JwtUtils jwtTokenUtils;

    private final MyUserDetailsService userDetailsService;

    @Value("${salt}")
    private String SALT;

    @Override
    public ResponseEntity<String> getUserName(String token) {
        var userName = jwtTokenUtils.getUserNameViaToken(token);

        if (StringUtils.isEmpty(userName))
            return new ResponseEntity<>("", headers, HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(userName, headers, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Boolean> logout(String token) {
        var userName = jwtTokenUtils.getUserNameViaToken(token);

        if (StringUtils.isEmpty(userName))
            return new ResponseEntity<>(false, headers, HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(true, headers, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> createAuthenticationToken(AuthenticationRequest autRequest) throws Exception {
        if (StringUtils.isEmpty(autRequest.getUsername()) || StringUtils.isEmpty(autRequest.getPassword()))
            return new ResponseEntity<>("".toCharArray(), headers, HttpStatus.BAD_REQUEST);

        var user = userRepository.findByUsername(autRequest.getUsername());
        if (user == null)
            return new ResponseEntity<>("".toCharArray(), headers, HttpStatus.BAD_REQUEST);

        var u = usersRepository.findByUserId(user.getUserId());

        if (u == null) {
            return new ResponseEntity<>("".toCharArray(), headers, HttpStatus.BAD_REQUEST);
        }

        Integer maxLoginAttempts = 3;
        if (u.getIsLocked() || Objects.equals(maxLoginAttempts, u.getLoginAttempts())) {
            return new ResponseEntity<>("".toCharArray(), headers, HttpStatus.LOCKED);
        }

        Authentication newUser = userDetailsService.authenticateJwt(maxLoginAttempts, u, autRequest.getUsername(), encrypt(SALT, autRequest.getPassword()), Objects.equals(encrypt(SALT, autRequest.getPassword()), user.getPassword()));
        if (newUser == null)
            return new ResponseEntity<>("".toCharArray(), headers, HttpStatus.FORBIDDEN);

        try {
            authenticateManager.authenticate(newUser);
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or" +
                    " password", e);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(autRequest.getUsername());

        final AuthenticationResponse jwt = jwtTokenUtils.generateToken(userDetails);

        return new ResponseEntity<>(jwt, headers, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> jwtViaRefreshToken(String refreshToken) {
        String userName = null;
        if (StringUtils.isNotEmpty(refreshToken)) {
            try {
                if (jwtTokenUtils.extractAccessTokenStatus(refreshToken))
                    return new ResponseEntity<>("".toCharArray(), headers, HttpStatus.BAD_REQUEST);
                userName = jwtTokenUtils.extractUsername(refreshToken);
            } catch (Exception e) {
                logger.error("An error occurred", e);
            }
        }

        if (userName == null)
            return new ResponseEntity<>("".toCharArray(), headers, HttpStatus.BAD_REQUEST);

        final UserDetails userDetails = userDetailsService.loadUserByUsername(userName);

        final AuthenticationResponse jwt = jwtTokenUtils.generateToken(userDetails);

        return new ResponseEntity<>(jwt, headers, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Boolean> changePassword(String token, ChangePasswordModel changePasswordModel) {
        var userName = jwtTokenUtils.getUserNameViaToken(token);

        if (StringUtils.isEmpty(userName))
            return new ResponseEntity<>(false, headers, HttpStatus.BAD_REQUEST);

        var user = usersRepository.findByUserName(userName);

        if (user == null)
            return new ResponseEntity<>(false, headers, HttpStatus.BAD_REQUEST);

        if (!Objects.equals(user.getUserPassword(), encrypt(SALT, changePasswordModel.getOldPassword())))
            return new ResponseEntity<>(false, headers, HttpStatus.OK);

        user.setUserPassword(encrypt(SALT, changePasswordModel.getNewPassword()));
        usersRepository.save(user);

        return new ResponseEntity<>(true, headers, HttpStatus.OK);
    }

}
