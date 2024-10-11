package com.lagunapools.lagunapools.app.accounting.services;


import com.lagunapools.lagunapools.app.accounting.models.AttendancesStatsRequestDTO;
import com.lagunapools.lagunapools.app.accounting.models.GraphDataDTO;
import com.lagunapools.lagunapools.app.accounting.repository.AccountingEntity;
import com.lagunapools.lagunapools.app.accounting.repository.AccountingRepository;
import com.lagunapools.lagunapools.app.clients.repository.ClientsEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by Lazo on 10/12/24
 */

@Service
@RequiredArgsConstructor
public class AccountingStatsServiceImpl implements AccountingStatsService {

    private final AccountingRepository accountingRepository;

    @Override
    public GraphDataDTO getStats(AttendancesStatsRequestDTO request) {
        LocalDateTime df = getStartDate(request.getDayFrom(), request.getDayTo());
        LocalDateTime dt = getEndDate(request.getDayFrom(), request.getDayTo());

        List<AccountingEntity> accountingEntities = accountingRepository.findByDateRange(df, dt);

        List<Double> lineChartDataIncome = generateMonthlyIncomeData(df, dt, accountingEntities);

        //    TODO: Not correct
        List<Double> lineChartDataDebts = generateMonthlyDebtData(df, dt, accountingEntities);

        Double doughnutIncomeTotal = calculateTotalIncome(accountingEntities);

        //    TODO: Not correct
        Double doughnutDebtTotal = calculateTotalDebt(accountingEntities);

        return new GraphDataDTO(
                doughnutIncomeTotal,
                doughnutDebtTotal,
                lineChartDataIncome,
                lineChartDataDebts,
                df.toString(),
                dt.toString()
        );
    }

    private LocalDateTime getStartDate(LocalDateTime dayFrom, LocalDateTime dayTo) {
        if (dayFrom == null && dayTo == null) {
            return LocalDateTime.now().minusDays(1);
        } else if (dayFrom == null) {
            return dayTo.minusDays(1);
        }
        return dayFrom;
    }

    private LocalDateTime getEndDate(LocalDateTime dayFrom, LocalDateTime dayTo) {
        if (dayFrom == null && dayTo == null) {
            return LocalDateTime.now();
        } else if (dayTo == null) {
            return LocalDateTime.now().plusDays(1);
        }
        return dayTo;
    }

    private List<Double> generateMonthlyIncomeData(LocalDateTime df, LocalDateTime dt, List<AccountingEntity> accountingEntities) {
        Map<LocalDate, Double> monthlyIncomeMap = new HashMap<>();

        accountingEntities.stream()
                .filter(l -> !l.getDate().isBefore(df) && !l.getDate().isAfter(dt))
                .forEach(l -> {
                    LocalDate date = l.getDate().toLocalDate().withDayOfMonth(1);
                    monthlyIncomeMap.merge(date, l.getAmount(), Double::sum);
                });

        return buildLineChartData(df, dt, monthlyIncomeMap);
    }

    private List<Double> generateMonthlyDebtData(LocalDateTime df, LocalDateTime dt, List<AccountingEntity> accountingEntities) {
        Map<Long, Double> clientIncomeMap = accountingEntities.stream()
                .collect(Collectors.groupingBy(
                        l -> l.getClient().getId(),
                        Collectors.summingDouble(AccountingEntity::getAmount)
                ));

        Map<LocalDate, Double> monthlyDebtMap = new HashMap<>();

        accountingEntities.stream()
                .map(AccountingEntity::getClient)
                .distinct()
                .forEach(client -> {
                    double netDebt = calculateNetDebtForClient(client, clientIncomeMap);
                    if (netDebt > 0) {
                        LocalDate debtMonth = client.getExpDate().withDayOfMonth(1);
                        monthlyDebtMap.merge(debtMonth, netDebt, Double::sum);
                    }
                });

        return buildLineChartData(df, dt, monthlyDebtMap);
    }

    private Double calculateTotalIncome(List<AccountingEntity> accountingEntities) {
        return accountingEntities.stream()
                .mapToDouble(AccountingEntity::getAmount)
                .sum();
    }

    private Double calculateTotalDebt(List<AccountingEntity> accountingEntities) {
        Map<Long, Double> clientIncomeMap = accountingEntities.stream()
                .collect(Collectors.groupingBy(
                        l -> l.getClient().getId(),
                        Collectors.summingDouble(AccountingEntity::getAmount)
                ));

        return accountingEntities.stream()
                .map(AccountingEntity::getClient)
                .distinct()
                .mapToDouble(client -> calculateNetDebtForClient(client, clientIncomeMap))
                .sum();
    }

    private double calculateNetDebtForClient(ClientsEntity client, Map<Long, Double> clientIncomeMap) {
        LocalDate expDate = client.getExpDate();
        if (expDate == null || LocalDate.now().isBefore(expDate)) {
            return 0.0;
        }

        double cost = client.getCost();
        double monthsOfDebt = Period.between(expDate, LocalDate.now()).toTotalMonths();
        double totalDebt = monthsOfDebt * cost;

        double totalIncome = clientIncomeMap.getOrDefault(client.getId(), 0.0);
        return Math.max(totalDebt - totalIncome, 0.0);
    }

    private List<Double> buildLineChartData(LocalDateTime df, LocalDateTime dt, Map<LocalDate, Double> monthlyDataMap) {
        List<Double> lineChartData = new ArrayList<>();
        LocalDate current = df.toLocalDate().withDayOfMonth(1);
        LocalDate end = dt.toLocalDate().withDayOfMonth(1);

        while (!current.isAfter(end)) {
            lineChartData.add(monthlyDataMap.getOrDefault(current, 0.0));
            current = current.plusMonths(1);
        }

        return lineChartData;
    }
}
