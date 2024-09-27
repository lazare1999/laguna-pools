package com.lagunapools.lagunapools.app.admin.controller;


import com.lagunapools.lagunapools.app.admin.models.ActiveUsersResponseModel;
import com.lagunapools.lagunapools.app.admin.models.ActiveUsersSearchModel;
import com.lagunapools.lagunapools.app.admin.models.UsersResponseModel;
import com.lagunapools.lagunapools.app.admin.models.UsersSearchModel;
import com.lagunapools.lagunapools.app.admin.services.AdminSearchService;
import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Created by Lazo on 9/27/24
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("admin/search")
@PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
public class AdminSearchController {

    private final AdminSearchService adminSearchService;

    @GetMapping(value = "/active_users")
    public ActiveUsersResponseModel listActiveUsers(@ModelAttribute ActiveUsersSearchModel model) {
        return adminSearchService.listActiveUsers(model);
    }

    @GetMapping(value = "/all_users")
    public UsersResponseModel listAllUsers(@ModelAttribute UsersSearchModel model) {
        return adminSearchService.listAllUsers(model);
    }

    @GetMapping(value = "/user_details")
    public ResponseEntity<UsersDomain> getUserDetails(@RequestParam Long userId) {
        return adminSearchService.getUserDetails(userId);
    }
}
