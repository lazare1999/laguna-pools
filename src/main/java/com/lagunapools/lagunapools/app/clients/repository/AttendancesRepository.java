package com.lagunapools.lagunapools.app.clients.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendancesRepository extends JpaRepository<AttendanceEntity, Long> {
    List<AttendanceEntity> getAllByClient(ClientsEntity client);
}
