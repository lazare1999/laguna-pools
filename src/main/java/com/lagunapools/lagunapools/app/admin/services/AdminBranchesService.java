package com.lagunapools.lagunapools.app.admin.services;

import com.lagunapools.lagunapools.app.branches.repository.BranchEntity;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AdminBranchesService {

    List<BranchEntity> listBranches();

    ResponseEntity<?> addBranch(String branchName);

    ResponseEntity<?> removeBranch(Long branchId);

}
