package com.lagunapools.lagunapools.app.user.services;

import com.lagunapools.lagunapools.app.user.domains.AppUser;
import com.lagunapools.lagunapools.app.user.domains.UsersDomain;
import com.lagunapools.lagunapools.app.user.repository.UserRepository;
import com.lagunapools.lagunapools.app.user.repository.UsersRepository;
import com.lagunapools.lagunapools.security.ApplicationUser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
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

import javax.sql.DataSource;
import java.util.List;
import java.util.Optional;

/**
 * Created by Lazo on 9/11/24
 */

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(MyUserDetailsService.class);
    private final UserRepository userRepository;
    private final UsersRepository usersRepository;

    @Getter
    private JdbcTemplate jdbcTemplate;

    private static final String authoritiesByUsernameQuery = "select user_name, role from users.user_role_sv where user_name=?";
    private static final String usersByUsernameQuery = "select user_id from users.active_users where user_name=?";
    private static final String getRoleIdQuery = "select user_role_id from users.user_roles where user_id=? and target_id=?";
    private static final String removeRoleByIdQuery = "delete from users.user_roles where user_id=? and target_id=?";
    private static final String getRole = "select target_id from users.targets where target_id=?";

    private void updateLastAuthorisedTime(Integer userId, String lastLoginIp) {
        String sql = "UPDATE users.users SET last_auth_date = now(), last_login_ip = ? WHERE user_id = ?";
        getJdbcTemplate().update(sql, lastLoginIp, userId);
    }

    private void logAuthorise(Integer userId, Integer is_success, String remote_address) {
        String sql = "INSERT INTO logs.authorise_history(user_id, is_success, remote_address) VALUES (?, ?, ?);";
        getJdbcTemplate().update(sql, userId, is_success, remote_address);
    }

    private List<GrantedAuthority> loadUserAuthorities(String username) {
        return getJdbcTemplate().query(authoritiesByUsernameQuery, (rs, rowNum) -> {
            String roleName = rs.getString(2);
            return new SimpleGrantedAuthority(roleName);
        }, username);
    }

    private Integer loadUserData(String username) {
        List<Integer> ans = getJdbcTemplate().query(usersByUsernameQuery, (rs, rowNum) -> rs.getInt(1), username);
        return ans.isEmpty() ? 0 : ans.get(0);
    }

    protected JdbcTemplate createJdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    protected void initTemplateConfig() {
    }

    public final void setDataSource(DataSource dataSource) {
        if (this.jdbcTemplate == null || dataSource != this.jdbcTemplate.getDataSource()) {
            this.jdbcTemplate = createJdbcTemplate(dataSource);
            initTemplateConfig();
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        AppUser user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }

        Integer userId = this.loadUserData(username);
        if (userId == 0) {
            return null;
        }

        var aut = loadUserAuthorities(username);

        ApplicationUser ans = null;
        try {
            ans = new ApplicationUser(userId, username, new BCryptPasswordEncoder().encode(user.getPassword()), true, true, true, true, aut);
        } catch (Exception e) {
            logger.error("An error occurred", e);
        }

        return ans;
    }

    public Boolean checkIfRoleExists(Long roleId) {
        if (roleId == null)
            return false;

        List<Integer> ans = getJdbcTemplate().query(getRole, (rs, rowNum) -> rs.getInt(1), roleId);

        return !ans.isEmpty();
    }

    public Boolean roleIsAlreadyDefined(Long userId, Long roleId) {
        if (userId == null || roleId == null)
            return false;

        List<Integer> ans = getJdbcTemplate().query(getRoleIdQuery, (rs, rowNum) -> rs.getInt(1), userId, roleId);

        return !ans.isEmpty();
    }

    public Boolean removeRoleByUserIdAndRoleId(Long userId, Long roleId) {

        List<Integer> ans = getJdbcTemplate().query(getRoleIdQuery, (rs, rowNum) -> rs.getInt(1), userId, roleId);

        if (ans.isEmpty())
            return false;

        int rowsAffected = getJdbcTemplate().update(removeRoleByIdQuery, userId, roleId);

        return rowsAffected > 0;
    }

    public Boolean addRole(Long userId, Long roleId) {
        if (userId == null || roleId == null)
            return false;

        String sql = "INSERT INTO users.user_roles(user_id, target_id) VALUES (?, ?);";
        getJdbcTemplate().update(sql, userId, roleId);
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

    public Authentication authenticateJwt(Integer maxLoginAttempts, UsersDomain u, String userName, String password, boolean success) throws AuthenticationException {
        String remoteAddress = null;
        ServletRequestAttributes ra = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (ra != null) {
            remoteAddress = getClientIp(ra.getRequest());
        }

        Integer userId = this.loadUserData(userName);
        if (userId == 0) {
            return null;
        }

        if (!success) {
            int loginAttempts = Optional.ofNullable(u.getLoginAttempts()).orElse(0);

            if (loginAttempts >= maxLoginAttempts) {
                lockUserAccount(u);
                return null;
            } else {
                incrementLoginAttempts(u, loginAttempts);
            }

            logAuthorise(userId, 0, remoteAddress);
            return null;
        }

        List<GrantedAuthority> grantedAuths = this.loadUserAuthorities(userName);
        ApplicationUser appUser = new ApplicationUser(userId, userName, password, true, true, true, true, grantedAuths);
        updateLastAuthorisedTime(userId, remoteAddress);
        logAuthorise(userId, 1, remoteAddress);

        return new UsernamePasswordAuthenticationToken(appUser, password, grantedAuths);
    }

    private void lockUserAccount(UsersDomain u) {
        u.setIsLocked(true);
        usersRepository.save(u);
    }

    private void incrementLoginAttempts(UsersDomain u, int currentAttempts) {
        u.setLoginAttempts(currentAttempts + 1);
        usersRepository.save(u);
    }


}
