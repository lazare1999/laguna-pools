package com.lagunapools.lagunapools.app.admin.services;


import com.lagunapools.lagunapools.app.admin.models.AddUserModel;
import com.lagunapools.lagunapools.app.admin.models.EditUserModel;
import com.lagunapools.lagunapools.app.admin.models.EditUsersListModel;
import com.lagunapools.lagunapools.app.user.domains.UserRolesDomain;
import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import com.lagunapools.lagunapools.app.user.repository.UserRolesRepository;
import com.lagunapools.lagunapools.app.user.repository.UsersRepository;
import com.lagunapools.lagunapools.common.models.ChangePasswordModel;
import io.micrometer.common.util.StringUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

import static com.lagunapools.lagunapools.utils.EncryptUtils.encrypt;
import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUser;
import static com.lagunapools.lagunapools.utils.ResponseUtils.badRequestResponse;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

/**
 * Created by Lazo on 9/16/24
 */

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UsersRepository usersRepository;
    private final UserRolesRepository userRolesRepository;

    @Value("${salt}")
    private String SALT;

    @Override
    @Transactional
    public ResponseEntity<?> addUser(AddUserModel u) {
        if (Objects.equals(u, null)
                || StringUtils.isEmpty(u.getPassword())
                || StringUtils.isEmpty(u.getUsername())
                || Objects.equals(u.getRoles(), null)
                || u.getRoles().isEmpty())
            return badRequestResponse(false);

        var userName = getCurrentApplicationUser().getUsername();

        if (!Objects.equals(usersRepository.findByUserName(u.getUsername()), null))
            return badRequestResponse("User already exists");

        var usersDomain = new UsersDomain(
                u.getUsername(),
                encrypt(SALT, u.getPassword()),
                userName,
                userName
        );
        var newUserId = usersRepository.saveAndFlush(usersDomain).getUserId();

        u.getRoles().forEach(r -> userRolesRepository.save(new UserRolesDomain(newUserId, r)));

        return okResponse(newUserId);
    }

    @Override
    public ResponseEntity<?> addUsers(List<AddUserModel> users) {
        if (Objects.equals(null, users))
            return badRequestResponse(false);
        users.forEach(this::addUser);
        return okResponse(true);
    }

    @Override
    @Transactional
    public ResponseEntity<?> removeUser(Long userId) {
        if (Objects.equals(null, userId))
            return badRequestResponse(false);

        if (usersRepository.findById(userId).isEmpty())
            return badRequestResponse("User does not exist");

        usersRepository.deleteById(userId);
        return okResponse(true);
    }

    @Override
    public ResponseEntity<?> removeUsers(List<Long> userIds) {
        if (Objects.equals(null, userIds))
            return badRequestResponse(false);
        userIds.forEach(this::removeUser);
        return okResponse(true);
    }

    @Override
    @Transactional
    public ResponseEntity<?> unlockOrLockUser(Long userId) {
        if (Objects.equals(userId, null))
            return badRequestResponse(false);

        var user0 = usersRepository.findById(userId);
        if (user0.isEmpty())
            return badRequestResponse("User does not exist");

        var currentUser = getCurrentApplicationUser();
        var user = user0.get();
        var currentLockState = user.getIsLocked();
        user.setIsLocked(!currentLockState);
        user.setUpdatedBy(currentUser.getUsername());
        usersRepository.save(user);

        return okResponse(!currentLockState);
    }

    @Override
    @Transactional
    public ResponseEntity<?> changeUserPassword(ChangePasswordModel cm) {
        if (Objects.equals(cm.getChangePasswordCandidateUserId(), null)
                || Objects.equals(cm.getNewPassword(), null))
            return badRequestResponse(false);

        var cUser = usersRepository.findByUserId(cm.getChangePasswordCandidateUserId());

        if (Objects.isNull(cUser))
            return badRequestResponse("User not found");

        cUser.setUserPassword(encrypt(SALT, cm.getNewPassword()));
        cUser.setUpdatedBy(getCurrentApplicationUser().getUsername());
        usersRepository.save(cUser);

        return okResponse(true);
    }

    @Override
    @Transactional
    public ResponseEntity<?> changeUserDetails(EditUserModel changeModel) {
        var cUser = usersRepository.findByUserId(changeModel.getUserId());
        if (!changeModel.getNewPassword().isEmpty()) {
            cUser.setUserPassword(encrypt(SALT, changeModel.getNewPassword()));
        }

        cUser.setUpdatedBy(getCurrentApplicationUser().getUsername());

        return okResponse(true);
    }

    @Override
    public ResponseEntity<?> changeUsersListDetails(EditUsersListModel changeModels) {
        changeModels.getUsers().forEach(this::changeUserDetails);
        return okResponse(true);
    }

}
