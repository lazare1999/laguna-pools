package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.GroupsResponseDTO;
import com.lagunapools.lagunapools.app.clients.repository.ClientsRepository;
import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.common.enums.Hour;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUser;
import static com.lagunapools.lagunapools.utils.ResponseUtils.badRequestResponse;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

@Service
@RequiredArgsConstructor
public class GroupsServiceImpl implements GroupsService {

    private final ClientsRepository clientsRepository;
    private final UserRepository userRepository;

    @Override
    public ResponseEntity<?> getGroupsTable() {
        Optional<AppUser> currentUserOpt = userRepository.findById(getCurrentApplicationUser().getUserId());
        if (currentUserOpt.isEmpty()) {
            return badRequestResponse("User not found");
        }

        AppUser currentUser = currentUserOpt.get();
        List<Object[]> results = clientsRepository.countClientsByHourAndDay(currentUser.getBranch().getId());

        GroupsResponseDTO responseDTO = new GroupsResponseDTO();

        for (DayOfWeek day : DayOfWeek.values()) {
            Map<String, Integer> hourCounts = new HashMap<>();

            for (Hour hour : Hour.values()) {
                hourCounts.put(hour.getHour(), 0);
            }

            responseDTO.addData(day, hourCounts);
        }

        for (Object[] result : results) {
            String dayStr = (String) result[0];
            String hourStr = (String) result[1];
            int count = ((Number) result[2]).intValue();

            DayOfWeek day = DayOfWeek.valueOf(dayStr.toUpperCase());

            Hour hour = Hour.fromValue(hourStr);

            responseDTO.getData().get(day).put(hour.getHour(), count);
        }

        return okResponse(responseDTO);
    }

}
