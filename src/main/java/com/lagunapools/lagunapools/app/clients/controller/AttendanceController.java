package com.lagunapools.lagunapools.app.clients.controller;

import com.lagunapools.lagunapools.app.clients.models.AttendanceDTO;
import com.lagunapools.lagunapools.app.clients.models.AttendancesDTO;
import com.lagunapools.lagunapools.app.clients.models.AttendancesRequestDTO;
import com.lagunapools.lagunapools.app.clients.service.AttendanceService;
import com.lagunapools.lagunapools.common.interefaces.PreAuthorizeLagunaRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("clients/attendance")
@PreAuthorizeLagunaRoles
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<?> addAttendance(@RequestBody AttendanceDTO request) {
        return attendanceService.addAttendance(request);
    }

    @PostMapping("/client")
    public AttendancesDTO getAttendances(@RequestBody AttendancesRequestDTO attendancesRequest) {
        return attendanceService.getAttendances(attendancesRequest);
    }
}
