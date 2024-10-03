package com.lagunapools.lagunapools.app.clients.service;

import org.springframework.http.ResponseEntity;

import java.util.List;

public interface GroupsService {
    ResponseEntity<?> getGroupsTable(List<String> branches);
}
