package com.lagunapools.lagunapools.app.logs.repository;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Created by Lazo on 9/24/24
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(schema = "logs", name = "authorise_history")
public class AuthoriseHistoryEntity {

    @Id
    @SequenceGenerator(name = "authorise_history_id_seq", sequenceName = "logs.authorise_history_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "authorise_history_id_seq")
    private Long id;

    private Long userId;
    private int isSuccess;
    private String remoteAddress;
    private LocalDateTime addData;

    public AuthoriseHistoryEntity(Long userId, int isSuccess, String remoteAddress) {
        this.userId = userId;
        this.isSuccess = isSuccess;
        this.remoteAddress = remoteAddress;
        this.addData = LocalDateTime.now();

    }


}
