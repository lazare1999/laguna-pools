package com.lagunapools.lagunapools.app.clients.models.attendances;


import com.lagunapools.lagunapools.app.clients.repository.AttendanceEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Created by Lazo on 10/4/24
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendancesDaysResponseDTO {
    private Long total;
    private List<AttendanceEntity> attendances;
}
