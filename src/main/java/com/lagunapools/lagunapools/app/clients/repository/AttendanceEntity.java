package com.lagunapools.lagunapools.app.clients.repository;

import com.lagunapools.lagunapools.app.clients.models.AttendanceDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(schema = "clients", name = "attendances")
@NoArgsConstructor
public class AttendanceEntity {
    @Id
    @SequenceGenerator(name = "attendances_id_seq", sequenceName = "clients.attendances_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "attendances_id_seq")
    private Long id;
    @Column(name = "time")
    private LocalDateTime time;
    @Column(name = "attended")
    private boolean attended;

    @Column(name = "client_id")
    private Long clientId;

    public AttendanceEntity(AttendanceDTO attendance) {
        this.id = attendance.getId();
        this.time = attendance.getTime();
        this.attended = attendance.isAttended();
        this.clientId = attendance.getClientId();
    }
}
