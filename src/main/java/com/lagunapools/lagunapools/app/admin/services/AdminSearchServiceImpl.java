package com.lagunapools.lagunapools.app.admin.services;


import com.lagunapools.lagunapools.app.admin.models.ActiveUsersResponseModel;
import com.lagunapools.lagunapools.app.admin.models.ActiveUsersSearchModel;
import com.lagunapools.lagunapools.app.admin.models.UsersSearchModel;
import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.app.user.repository.UsersRepository;
import com.lagunapools.lagunapools.utils.LazoUtils;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static com.lagunapools.lagunapools.utils.ResponseUtils.badRequestResponse;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

/**
 * Created by Lazo on 9/17/24
 */

@Service
@RequiredArgsConstructor
public class AdminSearchServiceImpl implements AdminSearchService {

    private final UserRepository userRepository;
    private final UsersRepository usersRepository;


    @Override
//    @Cacheable(value = "activeUsersCache", key = "#activeUsersSearchModel.toString()")
    public ActiveUsersResponseModel listActiveUsers(ActiveUsersSearchModel activeUsersSearchModel) {
        if (Objects.isNull(activeUsersSearchModel)
                || activeUsersSearchModel.getPageKey() == null
                || activeUsersSearchModel.getPageSize() == null) {
            return new ActiveUsersResponseModel();
        }

        var page = userRepository.findAll((root, query, builder) -> {
            Predicate predicate = builder.conjunction();

            if (StringUtils.isNotEmpty(activeUsersSearchModel.getUserName())) {
                predicate = builder.and(predicate, builder.like(root.get("username"), "%" + activeUsersSearchModel.getUserName() + "%"));
            }

            if (activeUsersSearchModel.getUserId() != null) {
                predicate = builder.and(predicate, builder.equal(root.get("userId"), activeUsersSearchModel.getUserId()));
            }

            if (activeUsersSearchModel.getLastAuthDateFrom() != null && activeUsersSearchModel.getLastAuthDateTo() != null) {
                predicate = builder.and(predicate,
                        builder.between(root.get("lastAuthDate"),
                                activeUsersSearchModel.getLastAuthDateFrom(),
                                activeUsersSearchModel.getLastAuthDateTo()));
            }

            if (activeUsersSearchModel.getIsLocked() != null) {
                predicate = builder.and(predicate, builder.equal(root.get("isLocked"), activeUsersSearchModel.getIsLocked()));
            }

            return predicate;
        }, PageRequest.of(activeUsersSearchModel.getPageKey(), activeUsersSearchModel.getPageSize(), LazoUtils.getSortAsc("userId")));

        return new ActiveUsersResponseModel(page.getTotalElements(), page.toList());
    }

    @Override
//    @Cacheable(value = "allUsersCache")
    public List<UsersDomain> listAllUsers(UsersSearchModel usersSearchModel) {

        if (Objects.isNull(usersSearchModel)
                || usersSearchModel.getPageKey() == null
                || usersSearchModel.getPageSize() == null) {
            return new ArrayList<>();
        }

        var page = usersRepository.findAll((root, query, builder) -> {
            Predicate predicate = builder.conjunction();

            if (usersSearchModel.getUserId() != null) {
                predicate = builder.and(predicate, builder.equal(root.get("userId"), usersSearchModel.getUserId()));
            }

            if (usersSearchModel.getUserName() != null) {
                predicate = builder.and(predicate, builder.like(root.get("userName"), "%" + usersSearchModel.getUserName() + "%"));
            }

            if (usersSearchModel.getStatusId() != null) {
                predicate = builder.and(predicate, builder.equal(root.get("statusId"), usersSearchModel.getStatusId()));
            }

            if (usersSearchModel.getLoginAttemptsFrom() != null && usersSearchModel.getLoginAttemptsTo() != null) {
                predicate = builder.and(predicate,
                        builder.between(root.get("loginAttempts"),
                                usersSearchModel.getLoginAttemptsFrom(),
                                usersSearchModel.getLoginAttemptsTo()));
            }

            if (usersSearchModel.getIsLocked() != null) {
                predicate = builder.and(predicate, builder.equal(root.get("isLocked"), usersSearchModel.getIsLocked()));
            }

            if (usersSearchModel.getCreatedBy() != null) {
                predicate = builder.and(predicate, builder.like(root.get("createdBy"), "%" + usersSearchModel.getCreatedBy() + "%"));
            }

            if (usersSearchModel.getUpdatedBy() != null) {
                predicate = builder.and(predicate, builder.like(root.get("updatedBy"), "%" + usersSearchModel.getUpdatedBy() + "%"));
            }

            if (usersSearchModel.getLastLoginIp() != null) {
                predicate = builder.and(predicate, builder.like(root.get("lastLoginIp"), "%" + usersSearchModel.getLastLoginIp() + "%"));
            }

            if (usersSearchModel.getAddDateFrom() != null && usersSearchModel.getAddDateTo() != null) {
                predicate = builder.and(predicate,
                        builder.between(root.get("addDate"),
                                usersSearchModel.getAddDateFrom(),
                                usersSearchModel.getAddDateTo()));
            }

            if (usersSearchModel.getLastAuthDateFrom() != null && usersSearchModel.getLastAuthDateTo() != null) {
                predicate = builder.and(predicate,
                        builder.between(root.get("lastAuthDate"),
                                usersSearchModel.getLastAuthDateFrom(),
                                usersSearchModel.getLastAuthDateTo()));
            }

            return predicate;
        }, PageRequest.of(usersSearchModel.getPageKey(), usersSearchModel.getPageSize(), LazoUtils.getSortAsc("userId")));

        return page.toList();
    }

    @Override
    public ResponseEntity<UsersDomain> getUserDetails(Long userId) {
        if (Objects.isNull(userId))
            return badRequestResponse(null);

        return okResponse(usersRepository.findByUserId(userId));
    }
}
