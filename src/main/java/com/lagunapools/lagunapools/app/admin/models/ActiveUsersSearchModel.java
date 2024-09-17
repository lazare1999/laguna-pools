package com.lagunapools.lagunapools.app.admin.models;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Created by Lazo on 9/17/24
 */

@Getter
@Setter
@NoArgsConstructor
public class ActiveUsersSearchModel implements Serializable {
    private Integer pageKey;
    private Integer pageSize;
    private Long userId;
    private String userName;
    private LocalDateTime lastAuthDateFrom;
    private LocalDateTime lastAuthDateTo;
    private Boolean isLocked;
}
