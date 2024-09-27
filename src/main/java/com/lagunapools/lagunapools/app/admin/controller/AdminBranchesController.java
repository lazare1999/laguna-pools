package com.lagunapools.lagunapools.app.admin.controller;


import com.lagunapools.lagunapools.app.admin.models.ListBranchDetailedResponseModel;
import com.lagunapools.lagunapools.app.admin.services.AdminBranchesService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by Lazo on 9/27/24
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("admin/branches")
@PreAuthorize("hasRole('ROLE_LAGUNA_ADMIN')")
public class AdminBranchesController {

    private final AdminBranchesService adminBranchesService;

    @GetMapping({"/list_branches"})
    @Cacheable(value = "branchesList")
    public List<ListBranchDetailedResponseModel> listBranches() {
        return adminBranchesService.listBranches();
    }

    @PostMapping({"/add_branch"})
    public ResponseEntity<?> addBranch(@RequestParam String branchName) {
        return adminBranchesService.addBranch(branchName);
    }

    @GetMapping({"/remove_branch"})
    public ResponseEntity<?> removeBranch(@RequestParam Long branchId) {
        return adminBranchesService.removeBranch(branchId);
    }
}
