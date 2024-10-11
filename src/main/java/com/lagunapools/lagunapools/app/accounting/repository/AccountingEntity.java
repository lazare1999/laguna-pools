package com.lagunapools.lagunapools.app.accounting.repository;


import com.lagunapools.lagunapools.app.accounting.models.AddAccountingRequestDTO;
import com.lagunapools.lagunapools.app.clients.repository.ClientsEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Created by Lazo on 10/10/24
 */

@Entity
@Getter
@Setter
@Table(schema = "accounting", name = "accounting")
@NoArgsConstructor
public class AccountingEntity {

    @Id
    @SequenceGenerator(name = "accounting_id_seq", sequenceName = "accounting.accounting_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "accounting_id_seq")
    private Long id;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "type")
    private String type;

    @Column(name = "client_id", insertable = false, updatable = false)
    private Long clientId;

    @ManyToOne
    @JoinColumn(name = "client_id", referencedColumnName = "id")
    private ClientsEntity client;

    public AccountingEntity(Double amount, String type, Long clientId) {
        this.clientId = clientId;
        this.amount = amount;
        this.date = LocalDateTime.now();
        this.type = type;
    }

    public AccountingEntity(AddAccountingRequestDTO accounting) {
        this.clientId = accounting.getClientId();
        this.amount = accounting.getAmount();
        this.date = LocalDateTime.now();
        this.type = accounting.getType();
    }


}
