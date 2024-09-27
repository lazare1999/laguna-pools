package com.lagunapools.lagunapools.app.admin.services;


import com.lagunapools.lagunapools.app.admin.models.ListBranchDetailedResponseModel;
import com.lagunapools.lagunapools.app.branches.repository.BranchEntity;
import com.lagunapools.lagunapools.app.branches.repository.BranchRepository;
import com.lagunapools.lagunapools.app.clients.repository.ClientsRepository;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.app.user.repository.UsersRepository;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

/**
 * Created by Lazo on 9/26/24
 */

@Service
@RequiredArgsConstructor
public class AdminBranchesServiceImpl implements AdminBranchesService {

    private final BranchRepository branchRepository;
    private final ClientsRepository clientsRepository;
    private final UserRepository userRepository;
    private final UsersRepository usersRepository;

    @Override
    @Cacheable(value = "branchesList")
    public List<ListBranchDetailedResponseModel> listBranches() {
        return branchRepository.findAll().stream()
                .map(branch -> new ListBranchDetailedResponseModel(
                        branch.getId(),
                        branch.getBranchName(),
                        userRepository.countByBranchId(branch.getId()),
                        clientsRepository.countByBranchId(branch.getId())
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = "branchesList", allEntries = true)
    public ResponseEntity<?> addBranch(String branchName) {
        if (StringUtils.isEmpty(branchName))
            return okResponse("Branch name cannot be empty");

        branchRepository.save(new BranchEntity(branchName));
        return okResponse("Branch successfully added");
    }

    @Override
    @Transactional
    @CacheEvict(value = "branchesList", allEntries = true)
    public ResponseEntity<?> removeBranch(Long branchId) {
        if (branchId == null)
            return okResponse("Branch id cannot be null");

        usersRepository.updateBranchIdToZero(branchId);
        clientsRepository.updateBranchIdToZero(branchId);

        branchRepository.deleteById(branchId);

        return okResponse("Branch successfully removed");
    }

}
