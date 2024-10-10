package com.lagunapools.lagunapools.app.accounting.models;


import com.lagunapools.lagunapools.app.accounting.repository.AccountingEntity;
import com.lagunapools.lagunapools.app.clients.models.ClientDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Created by Lazo on 10/10/24
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountingClientDTO {
    private Long id;
    private Double amount;
    private LocalDateTime date;
    private String type;
    private ClientDTO client;

    public AccountingClientDTO(AccountingEntity accountingEntity) {
        this.id = accountingEntity.getId();
        this.amount = accountingEntity.getAmount();
        this.date = accountingEntity.getDate();
        this.type = accountingEntity.getType();
        this.client = new ClientDTO(accountingEntity.getClient());
    }
}
