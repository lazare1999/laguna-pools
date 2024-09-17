package com.lagunapools.lagunapools.app.user.repository;

import com.lagunapools.lagunapools.app.user.domains.AppUser;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Created by Lazo on 2024-09-11
 */

public interface UserRepository extends JpaRepository<AppUser, Long>, JpaSpecificationExecutor<AppUser> {

    @Cacheable(value = "appUsersByUsername", key = "#username")
    AppUser findByUsername(String username);

    @Query("select u.userId from AppUser u where u.username = :username")
    Long findUserIdByUsername(@Param("username") String username);

    @Query("select u.username from AppUser u where u.userId = :userId")
    String findUsernameByUserId(@Param("userId") Long userId);

}
