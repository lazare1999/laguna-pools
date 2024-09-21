package com.lagunapools.lagunapools.app.admin.models;


import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActiveUsersSearchModel implements Serializable {
    private Integer pageKey;
    private Integer pageSize;
    private Long userId;
    private String userName;
    private LocalDateTime lastAuthDateFrom;
    private LocalDateTime lastAuthDateTo;
    private Boolean isLocked;
    private List<String> roles;

    @Override
    public String toString() {
        return super.toString();
    }

}
