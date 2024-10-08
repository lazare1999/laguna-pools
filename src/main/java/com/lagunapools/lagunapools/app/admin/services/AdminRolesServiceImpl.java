package com.lagunapools.lagunapools.app.admin.services;


import com.lagunapools.lagunapools.app.admin.models.AddRemoveRoleModel;
import com.lagunapools.lagunapools.app.user.domains.TargetViewDomain;
import com.lagunapools.lagunapools.app.user.repository.TargetViewRepository;
import com.lagunapools.lagunapools.app.user.services.MyUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

import static com.lagunapools.lagunapools.utils.ResponseUtils.badRequestResponse;
import static com.lagunapools.lagunapools.utils.ResponseUtils.okResponse;

/**
 * Created by Lazo on 9/17/24
 */

@Service
@RequiredArgsConstructor
public class AdminRolesServiceImpl implements AdminRolesService {

    private final MyUserDetailsService userDetailsService;
    private final TargetViewRepository targetViewRepository;

    @Override
    @Cacheable(value = "rolesList")
    public List<TargetViewDomain> listRoles() {
        return targetViewRepository.findAll();
    }

    @Override
    public ResponseEntity<?> addRole(AddRemoveRoleModel rm) {
        if (Objects.equals(rm.getRoleId(), null)
                || Objects.equals(rm.getUserId(), null)
                || Objects.equals(rm.getUserId(), 0L))
            return badRequestResponse(false);

        if (!userDetailsService.checkIfRoleExists(rm.getRoleId()))
            return badRequestResponse(false);

        if (userDetailsService.roleIsAlreadyDefined(rm.getUserId(), rm.getRoleId()))
            return okResponse("Role already exists");

        if (!userDetailsService.addRole(rm.getUserId(), rm.getRoleId()))
            return badRequestResponse(false);

        return okResponse(true);
    }

    @Override
    public ResponseEntity<?> removeRole(AddRemoveRoleModel rm) {
        if (Objects.equals(rm.getRoleId(), null)
                || Objects.equals(rm.getUserId(), null)
                || Objects.equals(rm.getUserId(), 0L))
            return badRequestResponse(false);

        if (!userDetailsService.checkIfRoleExists(rm.getRoleId()))
            return badRequestResponse(false);

        var ans = userDetailsService.removeRoleByUserIdAndRoleId(rm.getUserId(), rm.getRoleId());
        return okResponse(ans);
    }

}
