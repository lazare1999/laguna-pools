package com.lagunapools.lagunapools.app.accounting.services;


import com.lagunapools.lagunapools.app.accounting.models.AccountingClientDTO;
import com.lagunapools.lagunapools.app.accounting.models.AccountingResponseDTO;
import com.lagunapools.lagunapools.app.accounting.models.AddAccountingRequestDTO;
import com.lagunapools.lagunapools.app.accounting.models.AttendancesRequestDTO;
import com.lagunapools.lagunapools.app.accounting.repository.AccountingEntity;
import com.lagunapools.lagunapools.app.accounting.repository.AccountingRepository;
import com.lagunapools.lagunapools.app.clients.repository.ClientsEntity;
import com.lagunapools.lagunapools.app.clients.repository.ClientsRepository;
import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.app.user.services.MyUserDetailsService;
import com.lagunapools.lagunapools.utils.LazoUtils;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUser;
import static com.lagunapools.lagunapools.utils.ResponseUtils.badRequestResponse;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

/**
 * Created by Lazo on 10/10/24
 */

@Service
@RequiredArgsConstructor
public class AccountingServiceImpl implements AccountingService {

    private final AccountingRepository accountingRepository;
    private final UserRepository userRepository;
    private final MyUserDetailsService userDetailsService;

    private final ClientsRepository clientsRepository;

    @Override
    public AccountingResponseDTO getAccounting(AttendancesRequestDTO request) {
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

            if (StringUtils.isNotEmpty(request.getType()))
                predicate = builder.and(predicate, builder.equal(root.get("type"), request.getType()));

            return predicate;
        }, PageRequest.of(request.getPageKey(), request.getPageSize(), LazoUtils.getSortAsc("id")));

        List<AccountingClientDTO> list = page.stream().map(AccountingClientDTO::new).toList();

        return new AccountingResponseDTO(page.getTotalElements(), list);
    }

    @Override
    public ResponseEntity<?> addAccounting(AddAccountingRequestDTO request) {
        try {
            AccountingEntity accounting = new AccountingEntity(request);
            ClientsEntity client = clientsRepository.findById(request.getClientId()).orElseThrow();

            if (client.getDebt() != null && request.getAmount() != null)
                client.setDebt(client.getDebt() - request.getAmount());

            accounting.setClient(client);
            accountingRepository.save(accounting);

            return okResponse(client);
        } catch (Exception e) {
            return badRequestResponse(e.getStackTrace());
        }
    }

    @Override
    public ResponseEntity<?> calcIncome(List<String> branches) {
        return okResponse(accountingRepository.findTodayTotalAmount(branches));
    }

    @Override
    public ResponseEntity<?> deleteTransaction(Long id) {
        if (id == null)
            return badRequestResponse("Invalid transaction id");

        if (accountingRepository.findById(id).isPresent())
            accountingRepository.deleteById(id);

        return okResponse("Transaction with id " + id + " deleted!");

    }
}

