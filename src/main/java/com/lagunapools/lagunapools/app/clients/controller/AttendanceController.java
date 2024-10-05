package com.lagunapools.lagunapools.app.clients.controller;

import com.lagunapools.lagunapools.app.clients.models.FetchAttendancesRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.attendances.*;
import com.lagunapools.lagunapools.app.clients.service.AttendanceService;
import com.lagunapools.lagunapools.common.interefaces.PreAuthorizeLagunaRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@PreAuthorizeLagunaRoles
@RequestMapping("attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public AttendancesDaysResponseDTO attendances(@ModelAttribute AttendancesDaysRequestDTO request) {
        return attendanceService.attendances(request);
    }

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
