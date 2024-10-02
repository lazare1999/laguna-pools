package com.lagunapools.lagunapools.app.clients.controller;

import com.lagunapools.lagunapools.app.clients.models.AddAttendancesRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.AttendanceDTO;
import com.lagunapools.lagunapools.app.clients.models.AttendancesDTO;
import com.lagunapools.lagunapools.app.clients.models.FetchAttendancesRequestDTO;
import com.lagunapools.lagunapools.app.clients.service.AttendanceService;
import com.lagunapools.lagunapools.common.interefaces.PreAuthorizeLagunaRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@PreAuthorizeLagunaRoles
@RequestMapping("attendances")
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<?> addAttendance(@RequestBody AttendanceDTO request) {
        return attendanceService.addAttendance(request);
    }

    @PostMapping("/client")
    public AttendancesDTO getAttendances(@RequestBody FetchAttendancesRequestDTO attendancesRequest) {
        return attendanceService.getAttendances(attendancesRequest);
    }

    @PostMapping("clients/add")
    public ResponseEntity<?> addAttendances(@RequestBody AddAttendancesRequestDTO request) {
        return this.attendanceService.addAttendances(request);
    }
}
