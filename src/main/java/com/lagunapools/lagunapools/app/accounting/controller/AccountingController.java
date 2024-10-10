package com.lagunapools.lagunapools.app.accounting.controller;


import com.lagunapools.lagunapools.app.accounting.models.AccountingResponseDTO;
import com.lagunapools.lagunapools.app.accounting.models.AttendancesRequestDTO;
import com.lagunapools.lagunapools.app.accounting.services.AccountingService;
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
@RequestMapping("accounting")
public class AccountingController {

    private final AccountingService accountingService;

    @GetMapping
    public AccountingResponseDTO attendances(@ModelAttribute AttendancesRequestDTO request) {
        return accountingService.attendances(request);
    }


}
