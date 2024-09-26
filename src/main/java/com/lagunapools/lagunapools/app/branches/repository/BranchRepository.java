package com.lagunapools.lagunapools.app.branches.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Lazo on 9/26/24
 */

@Repository
public interface BranchRepository extends JpaRepository<BranchEntity, Long> {
    BranchEntity getBranchEntitiesByBranchName(String branchName);
}
