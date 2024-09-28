package com.lagunapools.lagunapools.app.clients.models;


import com.lagunapools.lagunapools.app.clients.repository.GroupEntity;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by Lazo on 9/25/24
 */

public class GroupMapper {
    public static List<GroupDTO> toDTOs(List<GroupEntity> entities) {
        return entities.stream()
                .map(e -> new GroupDTO(e.getId(),
                        e.getDay(),
                        e.getHour()))
                .collect(Collectors.toList());
    }

    public static List<GroupEntity> toEntities(List<GroupDTO> dtoS) {
        return dtoS.stream()
                .map(e -> new GroupEntity(e.getDay(), e.getHour()))
                .collect(Collectors.toList());
    }
}
