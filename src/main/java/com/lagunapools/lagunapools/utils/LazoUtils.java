package com.lagunapools.lagunapools.utils;

import com.lagunapools.lagunapools.app.user.repository.UsersRepository;
import com.lagunapools.lagunapools.security.ApplicationUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Lazo on 2024-09-11
 */

@Service
@RequiredArgsConstructor
public class LazoUtils {

    private final UsersRepository usersRepository;

    public static <T> T mostCommonListValue(List<T> list) {
        if (list.isEmpty())
            return null;

        Map<T, Integer> map = new HashMap<>();

        for (T t : list) {
            map.compute(t, (k, val) -> val == null ? 1 : val + 1);
        }

        Map.Entry<T, Integer> max = null;

        for (Map.Entry<T, Integer> e : map.entrySet()) {
            if (max == null || e.getValue() > max.getValue())
                max = e;
        }

        return max != null ? max.getKey() : null;
    }

    public static ApplicationUser getCurrentApplicationUser() {
        return (ApplicationUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static Integer getCurrentApplicationUserId() {
        return ((ApplicationUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
    }

    public static Sort getSortAsc(String s) {
        return Sort.by(new Sort.Order(Sort.Direction.ASC, s));
    }

    public static Sort getSortDesc(String s) {
        return Sort.by(new Sort.Order(Sort.Direction.DESC, s));
    }


}