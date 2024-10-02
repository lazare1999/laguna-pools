package com.lagunapools.lagunapools.app.clients.models.groups;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

/**
 * Created by Lazo on 10/2/24
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupsCustomObject {
    private Map<String, GroupInfo> map;
}
