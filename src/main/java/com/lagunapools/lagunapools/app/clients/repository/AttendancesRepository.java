package com.lagunapools.lagunapools.app.clients.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendancesRepository extends JpaRepository<AttendanceEntity, Long> {
    Page<AttendanceEntity> findAllByClientId(Long clientId, Pageable pageable);

    @Transactional
    @Modifying(clearAutomatically = true)
    void deleteAllByClientId(Long clientId);
}
