package com.lagunapools.lagunapools.app.clients.repository;

import com.lagunapools.lagunapools.app.clients.models.AttendanceDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    private Long id;
    private LocalDateTime time;
    private boolean attended;

    @ManyToOne
    private ClientsEntity client;

    public AttendanceEntity(AttendanceDTO attendance) {
        this.id = attendance.getId();
        this.time = attendance.getTime();
        this.attended = attendance.isAttended();
    }
}
