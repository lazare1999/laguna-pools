package com.lagunapools.lagunapools.app.clients.models;

import com.lagunapools.lagunapools.common.utils.DateEnum;
import com.lagunapools.lagunapools.common.utils.HoursEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupDTO {
    private Long id;
    private DateEnum day;
    private HoursEnum hour;
}
