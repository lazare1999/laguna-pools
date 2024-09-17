package com.lagunapools.lagunapools.app.admin.services;

import com.lagunapools.lagunapools.app.admin.models.ActiveUsersSearchModel;
import com.lagunapools.lagunapools.app.admin.models.UsersSearchModel;
import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AdminSearchService {

    List<AppUser> listActiveUsers(ActiveUsersSearchModel model);

    List<UsersDomain> listAllUsers(UsersSearchModel model);

    ResponseEntity<UsersDomain> getUserDetails(Long userId);
}
