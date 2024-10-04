package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.FetchAttendancesRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.attendances.*;
import org.springframework.http.ResponseEntity;

public interface AttendanceService {

    AttendancesDaysResponseDTO attendances(AttendancesDaysRequestDTO request);

    ResponseEntity<?> addAttendance(AttendanceDTO attendanceDTO);

    AttendancesDTO getAttendances(FetchAttendancesRequestDTO attendancesRequest);

    ResponseEntity<?> addAttendances(AddAttendancesRequestDTO request);
}
