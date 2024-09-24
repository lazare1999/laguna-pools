package com.lagunapools.lagunapools.app.admin.services;

import com.lagunapools.lagunapools.app.admin.models.ActiveUsersResponseModel;
import com.lagunapools.lagunapools.app.admin.models.ActiveUsersSearchModel;
import com.lagunapools.lagunapools.app.admin.models.UsersResponseModel;
import com.lagunapools.lagunapools.app.admin.models.UsersSearchModel;
import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import org.springframework.http.ResponseEntity;

public interface AdminSearchService {

    ActiveUsersResponseModel listActiveUsers(ActiveUsersSearchModel model);

    UsersResponseModel listAllUsers(UsersSearchModel usersSearchModel);

    ResponseEntity<UsersDomain> getUserDetails(Long userId);
}
