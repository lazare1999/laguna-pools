package com.lagunapools.lagunapools.app.accounting.services;


import com.lagunapools.lagunapools.app.accounting.models.*;
import com.lagunapools.lagunapools.app.accounting.repository.AccountingEntity;
import com.lagunapools.lagunapools.app.accounting.repository.AccountingRepository;
import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.app.user.services.MyUserDetailsService;
import com.lagunapools.lagunapools.utils.LazoUtils;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUser;

/**
 * Created by Lazo on 10/10/24
 */

@Service
@RequiredArgsConstructor
public class AccountingServiceImpl implements AccountingService {

    private final AccountingRepository accountingRepository;
    private final UserRepository userRepository;
    private final MyUserDetailsService userDetailsService;

    @Override
    public AccountingResponseDTO attendances(AttendancesRequestDTO request) {
        if (request.getPageKey() == null || request.getPageSize() == null)
            return new AccountingResponseDTO();

        var df = request.getDayFrom();
        var dt = request.getDayTo();

        boolean isAdmin = userDetailsService.userIsAdmin();

        Page<AccountingEntity> page = accountingRepository.findAll((root, query, builder) -> {
            Objects.requireNonNull(query).distinct(true);
            Predicate predicate = builder.conjunction();

            if (isAdmin && !request.getBranches().isEmpty()) {
                predicate = builder.and(predicate, builder.in(root.get("client").get("branch").get("branchName")).value(request.getBranches()));
            } else if (!isAdmin) {
                Optional<AppUser> currentUserOpt = userRepository.findById(getCurrentApplicationUser().getUserId());
                if (currentUserOpt.isPresent()) {
                    AppUser currentUser = currentUserOpt.get();
                    predicate = builder.and(predicate, builder.equal(root.get("client").get("branch").get("branchName"), currentUser.getBranch().getBranchName()));
                }
            }

            if (StringUtils.isNotEmpty(request.getName()))
                predicate = builder.and(predicate, builder.like(root.get("client").get("firstName"), "%" + request.getName() + "%"));

            if (StringUtils.isNotEmpty(request.getLastname()))
                predicate = builder.and(predicate, builder.like(root.get("client").get("lastName"), "%" + request.getLastname() + "%"));

            if (df != null && dt != null) {
                predicate = builder.and(predicate,
                        builder.between(root.get("date"),
                                df,
                                dt));
            } else if (df != null) {
                predicate = builder.and(predicate,
                        builder.greaterThanOrEqualTo(root.get("date"), df));
            } else if (dt != null) {
                predicate = builder.and(predicate,
                        builder.lessThanOrEqualTo(root.get("date"), dt));
            }

            if (request.getType() != null)
                predicate = builder.and(predicate, builder.equal(root.get("type"), request.getType()));

            return predicate;
        }, PageRequest.of(request.getPageKey(), request.getPageSize(), LazoUtils.getSortAsc("id")));

        List<AccountingClientDTO> list = page.stream().map(AccountingClientDTO::new).toList();

        GraphDataDTO g = getGraphDataDTO(df, dt, list);

        return new AccountingResponseDTO(page.getTotalElements(), new AccountingDTO(g, list));
    }

    private static @NotNull GraphDataDTO getGraphDataDTO(LocalDateTime df, LocalDateTime dt, List<AccountingClientDTO> list) {
        if (df == null && dt == null) {
            df = LocalDateTime.now().minusDays(1);
            dt = LocalDateTime.now();
        } else if (df == null) {
            df = dt.minusDays(1);
        } else if (dt == null) {
            dt = LocalDateTime.now().plusDays(1);
        }

        List<Double> lineChartDataIncome = new ArrayList<>();
        List<Double> lineChartDataDebts = new ArrayList<>();

        Double doughnutIncomeTotal = list.stream()
                .mapToDouble(AccountingClientDTO::getAmount)
                .sum();

        Map<Long, Double> clientIncomeMap = list.stream()
                .collect(Collectors.groupingBy(
                        l -> l.getClient().getId(),
                        Collectors.summingDouble(AccountingClientDTO::getAmount)
                ));

        Map<LocalDate, Double> monthlyIncomeMap = new HashMap<>();

        LocalDateTime finalDf = df;
        LocalDateTime finalDt = dt;
        list.stream()
                .filter(l -> !l.getDate().isBefore(finalDf) && !l.getDate().isAfter(finalDt))
                .forEach(l -> {
                    LocalDate date = l.getDate().toLocalDate().withDayOfMonth(1);
                    monthlyIncomeMap.merge(date, l.getAmount(), Double::sum);
                });

        LocalDate current = df.toLocalDate().withDayOfMonth(1);
        LocalDate end = dt.toLocalDate().withDayOfMonth(1);

        while (!current.isAfter(end)) {
            lineChartDataIncome.add(monthlyIncomeMap.getOrDefault(current, 0.0));
            current = current.plusMonths(1);
        }

        Double doughnutDebtTotal = list.stream()
                .map(AccountingClientDTO::getClient)
                .distinct()
                .mapToDouble(client -> {
                    LocalDate expDate = client.getExpDate();
                    if (expDate == null || LocalDate.now().isBefore(expDate)) {
                        return 0.0;
                    }
                    double cost = client.getCost();
                    double monthsOfDebt = Period.between(expDate, LocalDate.now()).toTotalMonths();
                    double totalDebt = monthsOfDebt * cost;
                    double totalIncome = clientIncomeMap.getOrDefault(client.getId(), 0.0);
                    return Math.max(totalDebt - totalIncome, 0.0);
                })
                .sum();

        return new GraphDataDTO(
                doughnutIncomeTotal,
                doughnutDebtTotal,
                lineChartDataIncome,
                lineChartDataDebts,
                df.toString(),
                dt.toString()
        );
    }

}

