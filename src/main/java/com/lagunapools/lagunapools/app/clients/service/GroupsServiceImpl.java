package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.groups.GroupInfo;
import com.lagunapools.lagunapools.app.clients.models.groups.GroupsCustomObject;
import com.lagunapools.lagunapools.app.clients.models.groups.GroupsResponseDTO;
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

        List<Object[]> results = clientsRepository.countClientsByHourAndDay(currentUserOpt.get().getBranch().getId());
        GroupsResponseDTO responseDTO = initializeGroupsResponse();

        populateResponseWithData(results, responseDTO);

        return okResponse(responseDTO);
    }

    private GroupsResponseDTO initializeGroupsResponse() {
        GroupsResponseDTO responseDTO = new GroupsResponseDTO();

        for (DayOfWeek day : DayOfWeek.values()) {
            responseDTO.addData(day, new GroupsCustomObject());
        }

        return responseDTO;
    }

    private void populateResponseWithData(List<Object[]> results, GroupsResponseDTO responseDTO) {
        for (Object[] result : results) {
            DayOfWeek day = DayOfWeek.valueOf(((String) result[0]).toUpperCase());
            Hour hour = Hour.fromValue((String) result[1]);
            long id = ((Number) result[2]).intValue();
            long count = ((Number) result[3]).intValue();

            Map<String, GroupInfo> hourCounts = new HashMap<>();
            hourCounts.put(hour.getHour(), new GroupInfo(id, count));

            responseDTO.getData().get(day).setMap(hourCounts);
        }
    }
}
