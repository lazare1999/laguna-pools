package com.lagunapools.lagunapools.app.user.repository;

import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Created by Lazo on 9/11/24
 */

@Repository
public interface UsersRepository extends JpaRepository<UsersDomain, Long>, JpaSpecificationExecutor<UsersDomain> {

    Optional<UsersDomain> findByUserName(String userName);

    UsersDomain findByUserId(Long userId);

    boolean existsByTargetDomains_TargetId(Long roleId);

    boolean existsByUserIdAndTargetDomains_TargetId(Long userId, Long roleId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserRolesDomain ur WHERE ur.userId = :userId AND ur.targetId = :roleId")
    int removeRoleByUserIdAndRoleId(@Param("userId") Long userId, @Param("roleId") Long roleId);

    @Modifying
    @Transactional
    @Query("UPDATE users u SET u.branchId = 0 WHERE u.branchId = ?1")
    void updateBranchIdToZero(Long branchId);

}
