package com.lagunapools.lagunapools.app.admin.services;


import com.lagunapools.lagunapools.app.admin.models.ActiveUsersResponseModel;
import com.lagunapools.lagunapools.app.admin.models.ActiveUsersSearchModel;
import com.lagunapools.lagunapools.app.admin.models.UsersResponseModel;
import com.lagunapools.lagunapools.app.admin.models.UsersSearchModel;
import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.app.user.repository.UsersRepository;
import com.lagunapools.lagunapools.utils.LazoUtils;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
    @Transactional
//    @Cacheable(value = "activeUsersCache", key = "#activeUsersSearchModel.toString()")
    public ActiveUsersResponseModel listActiveUsers(ActiveUsersSearchModel activeUsersSearchModel) {
        if (Objects.isNull(activeUsersSearchModel)
                || activeUsersSearchModel.getPageKey() == null
                || activeUsersSearchModel.getPageSize() == null) {
            return new ActiveUsersResponseModel();
        }

        var page = userRepository.findAll((root, query, builder) -> {

            Objects.requireNonNull(query).distinct(true);
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

            if (activeUsersSearchModel.getRoles() != null && !activeUsersSearchModel.getRoles().isEmpty()) {
                List<String> roles = activeUsersSearchModel.getRoles();

                var subquery = query.subquery(Long.class);
                var subRoot = subquery.from(AppUser.class);

                subquery.select(builder.countDistinct(subRoot.get("targetDomains").get("targetDescription")))
                        .where(builder.equal(subRoot, root),
                                subRoot.get("targetDomains").get("targetDescription").in(roles));

                predicate = builder.and(
                        predicate,
                        builder.equal(subquery, (long) roles.size())
                );
            }

            if (activeUsersSearchModel.getBranches() != null && !activeUsersSearchModel.getBranches().isEmpty()) {

                predicate = builder.and(predicate, builder.in(root.get("branch").get("branchName")).value(activeUsersSearchModel.getBranches()));

            }

            return predicate;
        }, PageRequest.of(activeUsersSearchModel.getPageKey(), activeUsersSearchModel.getPageSize(), LazoUtils.getSortAsc("userId")));

        return new ActiveUsersResponseModel(page.getTotalElements(), page.toList());
    }

    @Override
//    @Cacheable(value = "allUsersCache")
    public UsersResponseModel listAllUsers(UsersSearchModel usersSearchModel) {

        if (Objects.isNull(usersSearchModel)
                || usersSearchModel.getPageKey() == null
                || usersSearchModel.getPageSize() == null) {
            return new UsersResponseModel();
        }

        var page = usersRepository.findAll((root, query, builder) -> {
            Predicate predicate = builder.conjunction();
            Objects.requireNonNull(query).distinct(true);

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

            if (usersSearchModel.getInActiveUsers() != null) {
                predicate = builder.and(predicate, builder.equal(root.get("statusId"), usersSearchModel.getInActiveUsers()));
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

            if (usersSearchModel.getRoles() != null && !usersSearchModel.getRoles().isEmpty()) {

                var subquery = query.subquery(Long.class);
                var subRoot = subquery.from(AppUser.class);
                var roles = usersSearchModel.getRoles();

                subquery.select(builder.countDistinct(subRoot.get("targetDomains").get("targetDescription")))
                        .where(builder.equal(subRoot, root), subRoot.get("targetDomains").get("targetDescription").in(roles));

                predicate = builder.and(
                        predicate,
                        builder.equal(subquery, (long) roles.size())
                );
            }

            return predicate;
        }, PageRequest.of(usersSearchModel.getPageKey(), usersSearchModel.getPageSize(), LazoUtils.getSortAsc("userId")));


        return new UsersResponseModel(page.getTotalElements(), page.toList());
    }

    @Override
    public ResponseEntity<UsersDomain> getUserDetails(Long userId) {
        if (Objects.isNull(userId))
            return badRequestResponse(null);

        return okResponse(usersRepository.findByUserId(userId));
    }
}
