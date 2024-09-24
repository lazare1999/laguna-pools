package com.lagunapools.lagunapools.app.user.repository;

import com.lagunapools.lagunapools.app.user.domains.TargetDomain;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TargetRepository extends JpaRepository<TargetDomain, Long> {
}
