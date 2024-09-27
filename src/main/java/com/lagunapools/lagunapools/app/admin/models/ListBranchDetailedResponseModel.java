package com.lagunapools.lagunapools.app.admin.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * Created by Lazo on 9/27/24
 */

@Getter
@Setter
@AllArgsConstructor
public class ListBranchDetailedResponseModel implements Serializable {
    private Long id;
    private String branchName;
    private Integer usersCount;
    private Integer clientsCount;
}
