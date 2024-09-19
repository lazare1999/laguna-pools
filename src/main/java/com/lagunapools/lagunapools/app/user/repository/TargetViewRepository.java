package com.lagunapools.lagunapools.app.user.repository;

import com.lagunapools.lagunapools.app.user.domains.TargetViewDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TargetViewRepository extends JpaRepository<TargetViewDomain, Long>, JpaSpecificationExecutor<TargetViewDomain> {
}
