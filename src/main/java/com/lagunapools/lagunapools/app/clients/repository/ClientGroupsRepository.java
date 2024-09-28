package com.lagunapools.lagunapools.app.clients.repository;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientGroupsRepository extends JpaRepository<ClientGroupsEntity, Long> {
    void deleteByClientId(Long clientId);
}
