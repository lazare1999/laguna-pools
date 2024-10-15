package com.lagunapools.lagunapools.app.accounting.controller;


import com.lagunapools.lagunapools.app.accounting.models.AttendancesStatsRequestDTO;
import com.lagunapools.lagunapools.app.accounting.models.GraphDataDTO;
import com.lagunapools.lagunapools.app.accounting.services.AccountingStatsService;
import com.lagunapools.lagunapools.common.interefaces.PreAuthorizeLagunaRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Lazo on 10/10/24
 */

@RestController
@RequiredArgsConstructor
@PreAuthorizeLagunaRoles
@RequestMapping("accounting/stats")
public class AccountingStatsController {

    private final AccountingStatsService accountingStatsService;

    @GetMapping
    public GraphDataDTO getStats(@ModelAttribute AttendancesStatsRequestDTO request) {
        return accountingStatsService.getStats(request);
    }


}
