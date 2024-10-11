package com.lagunapools.lagunapools.app.accounting.services;

import com.lagunapools.lagunapools.app.accounting.models.AttendancesStatsRequestDTO;
import com.lagunapools.lagunapools.app.accounting.models.GraphDataDTO;

public interface AccountingStatsService {
    GraphDataDTO getStats(AttendancesStatsRequestDTO request);
}
