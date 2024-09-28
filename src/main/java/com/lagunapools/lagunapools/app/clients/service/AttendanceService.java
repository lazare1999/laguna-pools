package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.AttendanceDTO;
import com.lagunapools.lagunapools.app.clients.models.AttendancesDTO;
import com.lagunapools.lagunapools.app.clients.models.AttendancesRequestDTO;
import org.springframework.http.ResponseEntity;

public interface AttendanceService {
    ResponseEntity<?> addAttendance(AttendanceDTO attendanceDTO);

    AttendancesDTO getAttendances(AttendancesRequestDTO attendancesRequest);
}
