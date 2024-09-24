package com.lagunapools.lagunapools.app.clients.repository;

import com.lagunapools.lagunapools.common.utils.DateEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DateEntity {
    @Id
    private Long id;
    private DateEnum day;
    private LocalDateTime timeFrom;
    private LocalDateTime timeTo;

    @ManyToOne
    private GroupEntity group;
}
