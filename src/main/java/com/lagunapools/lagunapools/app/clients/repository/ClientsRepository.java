package com.lagunapools.lagunapools.app.clients.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ClientsRepository extends JpaRepository<ClientsEntity, Long>, JpaSpecificationExecutor<ClientsEntity> {

    @Modifying
    @Transactional
    @Query("UPDATE ClientsEntity c SET c.branchId = 0 WHERE c.branchId = ?1")
    void updateBranchIdToZero(Long branchId);

    @Query("SELECT COUNT(c) FROM ClientsEntity c WHERE c.branchId = :branchId")
    Integer countByBranchId(@Param("branchId") Long branchId);

    @Query("SELECT g.day, g.hour, COUNT(c.id) " +
            "FROM ClientGroupsEntity cg " +
            "JOIN GroupEntity g ON cg.groupId = g.id " +
            "JOIN ClientsEntity c ON cg.clientId = c.id " +
            "WHERE c.branchId = :branchId " +
            "GROUP BY g.day, g.hour " +
            "ORDER BY g.day, g.hour")
    List<Object[]> countClientsByHourAndDay(Long branchId);

}
