package com.lagunapools.lagunapools.app.admin.services;

import com.lagunapools.lagunapools.app.admin.models.ListBranchDetailedResponseModel;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AdminBranchesService {

    List<ListBranchDetailedResponseModel> listBranches();

    ResponseEntity<?> addBranch(String branchName);

    ResponseEntity<?> removeBranch(Long branchId);

}
