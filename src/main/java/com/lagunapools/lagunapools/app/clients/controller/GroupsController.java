package com.lagunapools.lagunapools.app.clients.controller;


import com.lagunapools.lagunapools.app.clients.service.GroupsService;
import com.lagunapools.lagunapools.common.interefaces.PreAuthorizeLagunaRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by Lazo on 9/30/24
 */

@RestController
@RequiredArgsConstructor
@PreAuthorizeLagunaRoles
@RequestMapping("groups")
public class GroupsController {

    private final GroupsService groupsService;

    @GetMapping
    public ResponseEntity<?> getGroupsTable(@RequestParam List<String> branches) {
        return groupsService.getGroupsTable(branches);
    }

}
