package com.lagunapools.lagunapools.app.clients.models;


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

    private Map<DayOfWeek, Map<String, Integer>> data;

    public GroupsResponseDTO() {
        this.data = new HashMap<>();
    }

    public void addData(DayOfWeek day, Map<String, Integer> counts) {
        this.data.put(day, counts);
    }
}
