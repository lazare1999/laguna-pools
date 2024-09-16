package com.lagunapools.lagunapools.app.user.repository;

import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * Created by Lazo on 9/11/24
 */

public interface UsersRepository extends JpaRepository<UsersDomain, Long>, JpaSpecificationExecutor<UsersDomain> {

    UsersDomain findByUserName(String userName);

    UsersDomain findByUserId(Long userId);

}
