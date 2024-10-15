package com.lagunapools.lagunapools.app.accounting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AccountingRepository extends JpaRepository<AccountingEntity, Long>, JpaSpecificationExecutor<AccountingEntity>, AccountingCustomRepository {

    @Query("SELECT a FROM AccountingEntity a WHERE a.date >= :startDate AND a.date <= :endDate")
    List<AccountingEntity> findByDateRange(@Param("startDate") LocalDateTime df, @Param("endDate") LocalDateTime dt);

}
