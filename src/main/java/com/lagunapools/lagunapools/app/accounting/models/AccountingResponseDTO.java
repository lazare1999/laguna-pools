package com.lagunapools.lagunapools.app.accounting.models;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Created by Lazo on 10/10/24
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccountingResponseDTO {
    private Long total;
    private List<AccountingClientDTO> content;
}
