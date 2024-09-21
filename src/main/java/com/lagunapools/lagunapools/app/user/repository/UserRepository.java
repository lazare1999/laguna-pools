package com.lagunapools.lagunapools.app.user.repository;

import com.lagunapools.lagunapools.app.user.domains.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * Created by Lazo on 2024-09-11
 */

public interface UserRepository extends JpaRepository<AppUser, Long>, JpaSpecificationExecutor<AppUser> {

    //    @Cacheable(value = "appUsersByUsername", key = "#username")
    AppUser findByUsername(String username);

}
