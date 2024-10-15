package com.lagunapools.lagunapools.app.accounting.repository;

import java.util.List;

public interface AccountingCustomRepository {
    Double findTodayTotalAmount(List<String> branches);
}
