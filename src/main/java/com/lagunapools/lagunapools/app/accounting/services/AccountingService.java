package com.lagunapools.lagunapools.app.accounting.services;

import com.lagunapools.lagunapools.app.accounting.models.AccountingResponseDTO;
import com.lagunapools.lagunapools.app.accounting.models.AddAccountingRequestDTO;
import com.lagunapools.lagunapools.app.accounting.models.AttendancesRequestDTO;
import org.springframework.http.ResponseEntity;

public interface AccountingService {
    AccountingResponseDTO getAccounting(AttendancesRequestDTO request);

    ResponseEntity<?> addAccounting(AddAccountingRequestDTO request);
}
