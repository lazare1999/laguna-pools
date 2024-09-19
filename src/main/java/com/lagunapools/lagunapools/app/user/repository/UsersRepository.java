package com.lagunapools.lagunapools.app.user.repository;

import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * Created by Lazo on 9/11/24
 */

public interface UsersRepository extends JpaRepository<UsersDomain, Long>, JpaSpecificationExecutor<UsersDomain> {

    //    @Cacheable(value = "usersByUsername", key = "#userName")
    UsersDomain findByUserName(String userName);

    //    @Cacheable(value = "usersById", key = "#userId")
    UsersDomain findByUserId(Long userId);

}
