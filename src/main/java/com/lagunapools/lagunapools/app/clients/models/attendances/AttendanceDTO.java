package com.lagunapools.lagunapools.app.clients.models.attendances;

import com.lagunapools.lagunapools.app.clients.repository.AttendanceEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDTO {
    private Long id;
    private Long clientId;
    private LocalDateTime time;
    private boolean attended;

    public AttendanceDTO(AttendanceEntity attendance) {
        this.id = attendance.getId();
        this.clientId = attendance.getClientId();
        this.time = attendance.getTime();
        this.attended = attendance.isAttended();
    }

    public AttendanceDTO(Long clientId, LocalDateTime time, boolean attended) {
        this.clientId = clientId;
        this.time = time;
        this.attended = attended;
    }
}
