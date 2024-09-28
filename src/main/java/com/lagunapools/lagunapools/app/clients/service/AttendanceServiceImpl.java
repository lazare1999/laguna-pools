package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.AttendanceDTO;
import com.lagunapools.lagunapools.app.clients.models.AttendancesDTO;
import com.lagunapools.lagunapools.app.clients.models.AttendancesRequestDTO;
import com.lagunapools.lagunapools.app.clients.repository.AttendanceEntity;
import com.lagunapools.lagunapools.app.clients.repository.AttendancesRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendancesRepository attendancesRepository;

    @Override
    @Transactional
    public ResponseEntity<?> addAttendance(AttendanceDTO attendanceDTO) {
        AttendanceEntity attendance = new AttendanceEntity(attendanceDTO);
        attendancesRepository.save(attendance);
        return okResponse("Attendance added");
    }

    @Override
    @Transactional
    public AttendancesDTO getAttendances(AttendancesRequestDTO attendancesRequest) {
        Pageable pageable = PageRequest.of(attendancesRequest.getPageKey(), attendancesRequest.getPageSize());

        Page<AttendanceEntity> attendancesPage = attendancesRepository
                .findAllByClientId(attendancesRequest.getClientId(), pageable);
        List<AttendanceDTO> attendancesList = attendancesPage.stream().map(AttendanceDTO::new).toList();

        return new AttendancesDTO(attendancesPage.getTotalElements(), attendancesList);
    }
}
