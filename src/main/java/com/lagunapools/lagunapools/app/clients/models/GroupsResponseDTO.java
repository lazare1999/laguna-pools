package com.lagunapools.lagunapools.app.clients.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Lazo on 9/30/24
 */

@Getter
@Setter
@AllArgsConstructor
public class GroupsResponseDTO {

    private Map<String, List<Integer>> data;
    private static final List<Integer> DEFAULT_COUNTS = Arrays.asList(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

    public GroupsResponseDTO() {
        this.data = new HashMap<>();
        initializeDefaultData();
    }

    private void initializeDefaultData() {
        this.data.put("Monday", DEFAULT_COUNTS);
        this.data.put("Tuesday", DEFAULT_COUNTS);
        this.data.put("Wednesday", DEFAULT_COUNTS);
        this.data.put("Thursday", DEFAULT_COUNTS);
        this.data.put("Friday", DEFAULT_COUNTS);
        this.data.put("Saturday", DEFAULT_COUNTS);
        this.data.put("Sunday", DEFAULT_COUNTS);
    }

    public void addData(String day, List<Integer> counts) {
        this.data.put(day, counts);
    }
}
