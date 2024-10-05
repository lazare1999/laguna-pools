package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.FetchAttendancesRequestDTO;
import com.lagunapools.lagunapools.app.clients.models.attendances.*;
import com.lagunapools.lagunapools.app.clients.repository.AttendanceEntity;
import com.lagunapools.lagunapools.app.clients.repository.AttendancesRepository;
import com.lagunapools.lagunapools.app.clients.repository.ClientsRepository;
import com.lagunapools.lagunapools.utils.LazoUtils;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.lagunapools.lagunapools.utils.ResponseUtils.badRequestResponse;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    private final AttendancesRepository attendancesRepository;
    private final ClientsRepository clientsRepository;

    @Override
    public AttendancesDaysResponseDTO attendances(AttendancesDaysRequestDTO request) {
        if (request.getPageKey() == null || request.getPageSize() == null)
            return new AttendancesDaysResponseDTO();

        LocalDateTime time;
        if (request.getSelectedDay() != null && request.getSelectedTime() != null)
            time = LocalDateTime.of(request.getSelectedDay(), request.getSelectedTime());
        else
            time = null;

        Page<AttendanceEntity> page = attendancesRepository.findAll((root, query, builder) -> {
            Predicate predicate = builder.conjunction();

            predicate = builder.and(predicate, builder.equal(root.get("attended"), request.getAttended()));

            if (time != null)
                predicate = builder.and(predicate, builder.equal(root.get("time"), time));

            if (!request.getBranches().isEmpty())
                predicate = builder.and(predicate, builder.in(root.get("client").get("branch").get("branchName")).value(request.getBranches()));

            return predicate;
        }, PageRequest.of(request.getPageKey(), request.getPageSize(), LazoUtils.getSortAsc("id")));


        return new AttendancesDaysResponseDTO(page.getTotalElements(), page.toList());
    }

    @Override
    @Transactional
    public ResponseEntity<?> addAttendance(AttendanceDTO attendanceDTO) {
        try {
            AttendanceEntity attendance = new AttendanceEntity(attendanceDTO);
            attendance.setClient(clientsRepository.getReferenceById(attendanceDTO.getClientId()));
            attendancesRepository.save(attendance);
            return okResponse("Attendance added");
        } catch (Exception e) {
            e.printStackTrace();
            return badRequestResponse("Bad request!");
        }
    }

    @Override
    @Transactional
    public AttendancesDTO getAttendances(FetchAttendancesRequestDTO attendancesRequest) {
        Pageable pageable = PageRequest.of(attendancesRequest.getPageKey(), attendancesRequest.getPageSize());

        Page<AttendanceEntity> attendancesPage = attendancesRepository
                .findAllByClientId(attendancesRequest.getClientId(), pageable);
        List<AttendanceDTO> attendancesList = attendancesPage.stream().map(AttendanceDTO::new).toList();

        return new AttendancesDTO(attendancesPage.getTotalElements(), attendancesList);
    }

    @Override
    @Transactional
    public ResponseEntity<?> addAttendances(AddAttendancesRequestDTO request) {
        List<AttendanceDTO> attendances = request
                .getClientIds()
                .stream()
                .map(id -> new AttendanceDTO(id, request.getTime(), request.isAttended()))
                .toList();

        attendances.forEach(this::addAttendance);

        return okResponse("Clients added");
    }


}
