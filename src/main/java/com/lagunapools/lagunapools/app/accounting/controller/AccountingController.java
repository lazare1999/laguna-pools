package com.lagunapools.lagunapools.app.accounting.controller;


import com.lagunapools.lagunapools.app.accounting.models.AccountingResponseDTO;
import com.lagunapools.lagunapools.app.accounting.models.AddAccountingRequestDTO;
import com.lagunapools.lagunapools.app.accounting.models.AttendancesRequestDTO;
import com.lagunapools.lagunapools.app.accounting.services.AccountingService;
import com.lagunapools.lagunapools.common.interefaces.PreAuthorizeLagunaRoles;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public AccountingResponseDTO getAccounting(@ModelAttribute AttendancesRequestDTO request) {
        return accountingService.getAccounting(request);
    }

    @PostMapping
    public ResponseEntity<?> addAccounting(@RequestBody AddAccountingRequestDTO request) {
        return accountingService.addAccounting(request);
    }

    @GetMapping("calc_income")
    public ResponseEntity<?> calcIncome(@RequestParam List<String> branches) {
        return accountingService.calcIncome(branches);
    }

}
