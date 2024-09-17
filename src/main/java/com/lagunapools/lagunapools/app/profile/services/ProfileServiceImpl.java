package com.lagunapools.lagunapools.app.profile.services;


import com.lagunapools.lagunapools.app.user.repository.UsersRepository;
import com.lagunapools.lagunapools.common.models.ChangePasswordModel;
import com.lagunapools.lagunapools.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Objects;

import static com.lagunapools.lagunapools.utils.EncryptUtils.encrypt;
import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUserId;
import static com.lagunapools.lagunapools.utils.ResponseUtils.badRequestResponse;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

/**
 * Created by Lazo on 9/16/24
 */

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UsersRepository usersRepository;

    private final JwtUtils jwtTokenUtils;

    @Value("${salt}")
    private String SALT;

    @Override
    public ResponseEntity<?> changePassword(ChangePasswordModel changePasswordModel) {

        var user = usersRepository.findByUserId(Long.valueOf(getCurrentApplicationUserId()));

        if (Objects.isNull(user))
            return badRequestResponse("User not found");

        if (!Objects.equals(user.getUserPassword(), encrypt(SALT, changePasswordModel.getOldPassword())))
            return badRequestResponse("Old password does not match");

        user.setUserPassword(encrypt(SALT, changePasswordModel.getNewPassword()));
        user.setUpdatedBy(user.getUserName());
        usersRepository.save(user);

        return okResponse(true);
    }

}
