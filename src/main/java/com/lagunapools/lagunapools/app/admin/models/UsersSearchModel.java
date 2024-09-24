package com.lagunapools.lagunapools.app.admin.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by Lazo on 9/17/24
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    private Integer inActiveUsers;
    private List<String> roles;

    @Override
    public String toString() {
        return super.toString();
    }

}
