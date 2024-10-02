package com.lagunapools.lagunapools.app.clients.models.groups;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Lazo on 9/30/24
 */

@Getter
@Setter
@AllArgsConstructor
public class GroupsResponseDTO {

    private Map<DayOfWeek, GroupsCustomObject> data;

    public GroupsResponseDTO() {
        this.data = new HashMap<>();
    }

    public void addData(DayOfWeek day, GroupsCustomObject obj) {
        this.data.put(day, obj);
    }
}
