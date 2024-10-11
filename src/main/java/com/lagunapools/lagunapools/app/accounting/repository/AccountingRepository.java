package com.lagunapools.lagunapools.app.accounting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AccountingRepository extends JpaRepository<AccountingEntity, Long>, JpaSpecificationExecutor<AccountingEntity>, AccountingCustomRepository {
}
