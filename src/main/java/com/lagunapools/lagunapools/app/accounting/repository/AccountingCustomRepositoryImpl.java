package com.lagunapools.lagunapools.app.accounting.repository;


import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.app.user.services.MyUserDetailsService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUser;

/**
 * Created by Lazo on 10/11/24
 */

@Repository
@RequiredArgsConstructor
public class AccountingCustomRepositoryImpl implements AccountingCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    private final UserRepository userRepository;
    private final MyUserDetailsService userDetailsService;

    @Override
    public Double findTodayTotalAmount(List<String> branches) {
        boolean isAdmin = userDetailsService.userIsAdmin();

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Double> query = cb.createQuery(Double.class);
        Root<AccountingEntity> root = query.from(AccountingEntity.class);

        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        Predicate predicate = cb.between(root.get("date"), startOfDay, endOfDay);

        if (isAdmin && !branches.isEmpty()) {
            predicate = cb.and(predicate, root.get("branch").get("branchName").in(branches));
        } else if (!isAdmin) {
            Optional<AppUser> currentUserOpt = userRepository.findById(getCurrentApplicationUser().getUserId());
            if (currentUserOpt.isPresent()) {
                AppUser currentUser = currentUserOpt.get();
                String userBranchName = currentUser.getBranch().getBranchName();
                predicate = cb.and(predicate, cb.equal(root.get("branch").get("branchName"), userBranchName));
            }
        }

        query.select(cb.sum(root.get("amount"))).where(predicate);

        Double result = entityManager.createQuery(query).getSingleResult();
        return result != null ? result : 0.0;
    }

}
