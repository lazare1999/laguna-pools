package com.lagunapools.lagunapools.app.accounting.services;

import com.lagunapools.lagunapools.app.accounting.models.AccountingResponseDTO;
import com.lagunapools.lagunapools.app.accounting.models.AttendancesRequestDTO;

public interface AccountingService {
    AccountingResponseDTO attendances(AttendancesRequestDTO request);
}
