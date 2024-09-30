package com.lagunapools.lagunapools.app.clients.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface ClientGroupsRepository extends JpaRepository<ClientGroupsEntity, Long> {

    @Transactional
    @Modifying(clearAutomatically = true)
    void deleteAllByClientId(Long clientId);

}
