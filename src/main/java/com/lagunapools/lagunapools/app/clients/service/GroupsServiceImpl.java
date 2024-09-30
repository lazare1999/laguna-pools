package com.lagunapools.lagunapools.app.clients.service;

import com.lagunapools.lagunapools.app.clients.models.GroupsResponseDTO;
import com.lagunapools.lagunapools.app.clients.repository.ClientsRepository;
import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
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
        if (currentUserOpt.isEmpty())
            return badRequestResponse("User not found");
        AppUser currentUser = currentUserOpt.get();

        List<Object[]> results = clientsRepository.countClientsByHourAndDay(currentUser.getBranch().getId());

        GroupsResponseDTO responseDTO = new GroupsResponseDTO();

        for (Object[] result : results) {
            String day = (String) result[0];
            int hour = Integer.parseInt((String) result[1]);
            int count = ((Number) result[2]).intValue();

            responseDTO.getData().get(day).set(hour, count);
        }

        return okResponse(responseDTO);
    }

}
