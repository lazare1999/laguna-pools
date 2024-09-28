package com.lagunapools.lagunapools.app.user.services;

import com.lagunapools.lagunapools.app.logs.repository.AuthoriseHistoryEntity;
import com.lagunapools.lagunapools.app.logs.repository.AuthoriseHistoryRepository;
import com.lagunapools.lagunapools.app.user.domains.TargetDomain;
import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import com.lagunapools.lagunapools.app.user.repository.TargetRepository;
import com.lagunapools.lagunapools.app.user.repository.UsersRepository;
import com.lagunapools.lagunapools.security.ApplicationUser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.lagunapools.lagunapools.utils.LazoUtils.getCurrentApplicationUser;

/**
 * Created by Lazo on 9/11/24
 */

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private final UsersRepository usersRepository;
    private final TargetRepository targetRepository;
    private final AuthoriseHistoryRepository authoriseHistoryRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = usersRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return new ApplicationUser(user.getUserId(), user.getUserName(),
                new BCryptPasswordEncoder().encode(user.getUserPassword()),
                true, true, true, true, getGrantedAuthorities(user));
    }

    public Boolean checkIfRoleExists(Long roleId) {
        return roleId != null && usersRepository.existsByTargetDomains_TargetId(roleId);
    }

    public Boolean roleIsAlreadyDefined(Long userId, Long roleId) {
        if (userId == null || roleId == null) {
            return false;
        }
        return usersRepository.existsByUserIdAndTargetDomains_TargetId(userId, roleId);
    }

    public Boolean removeRoleByUserIdAndRoleId(Long userId, Long roleId) {
        if (userId == null || roleId == null) {
            return false;
        }
        return usersRepository.removeRoleByUserIdAndRoleId(userId, roleId) > 0;
    }

    public Boolean addRole(Long userId, Long roleId) {
        if (userId == null || roleId == null) {
            return false;
        }
        TargetDomain targetDomain = targetRepository.findById(roleId).orElse(null);
        if (targetDomain == null) return false;

        UsersDomain user = usersRepository.findById(userId).orElse(null);
        if (user == null) return false;

        user.getTargetDomains().add(targetDomain);
        usersRepository.save(user);
        return true;
    }

    private static String getClientIp(HttpServletRequest request) {
        String remoteAddr = "";
        if (request != null) {
            remoteAddr = request.getHeader("X-FORWARDED-FOR");
            if (remoteAddr == null || remoteAddr.isEmpty()) {
                remoteAddr = request.getRemoteAddr();
            }
        }
        return remoteAddr;
    }

    public Authentication authenticateJwt(Integer maxLoginAttempts, UsersDomain user, String userName, String password, boolean success) throws AuthenticationException {
        String remoteAddress = null;
        ServletRequestAttributes ra = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (ra != null) {
            remoteAddress = getClientIp(ra.getRequest());
        }

        var userId = user.getUserId();
        if (userId == 0) {
            return null;
        }

        if (!success) {
            logAuthorise(userId, 1, remoteAddress);

            int loginAttempts = Optional.ofNullable(user.getLoginAttempts()).orElse(0);
            if (loginAttempts >= maxLoginAttempts) {
                lockUserAccount(user);
            } else {
                incrementLoginAttempts(user, loginAttempts);
            }

            return null;
        }

        var grantedAuthorities = getGrantedAuthorities(user);

        ApplicationUser appUser = new ApplicationUser(userId, userName, password, true, true, true, true, grantedAuthorities);
        updateLastAuthorisedTime(userId, remoteAddress);
        logAuthorise(userId, 0, remoteAddress);

        return new UsernamePasswordAuthenticationToken(appUser, password, grantedAuthorities);
    }

    private void lockUserAccount(UsersDomain user) {
        user.setIsLocked(true);
        user.setLoginAttempts(0);
        usersRepository.save(user);
    }

    private void incrementLoginAttempts(UsersDomain user, int currentAttempts) {
        user.setLoginAttempts(currentAttempts + 1);
        usersRepository.save(user);
    }

    private void logAuthorise(Long userId, Integer isSuccess, String remoteAddress) {
        authoriseHistoryRepository.save(new AuthoriseHistoryEntity(userId, isSuccess, remoteAddress));
    }

    private void updateLastAuthorisedTime(Long userId, String lastLoginIp) {
        UsersDomain user = usersRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setLastAuthDate(LocalDateTime.now());
        user.setLastLoginIp(lastLoginIp);
        usersRepository.save(user);
    }

    public List<GrantedAuthority> getGrantedAuthorities(UsersDomain user) {
        return user.getTargetDomains().stream()
                .map(targetDomain -> (GrantedAuthority) new SimpleGrantedAuthority(targetDomain.getTargetName()))
                .toList();
    }

    public boolean userIsAdmin() {
        return getCurrentApplicationUser().getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_LAGUNA_ADMIN"));
    }
}
