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
public class UsersSearchModel implements Serializable {
    private Integer pageKey;
    private Integer pageSize;
    private Long userId;
    private String userName;
    private Integer statusId;
    private Integer loginAttemptsFrom = 0;
    private Integer loginAttemptsTo = 4;
    private Boolean isLocked;
    private String createdBy;
    private String updatedBy;
    private String lastLoginIp;
    private LocalDateTime addDateFrom;
    private LocalDateTime addDateTo;
    private LocalDateTime lastAuthDateFrom;
    private LocalDateTime lastAuthDateTo;

    @Override
    public String toString() {
        return super.toString();
    }

}
