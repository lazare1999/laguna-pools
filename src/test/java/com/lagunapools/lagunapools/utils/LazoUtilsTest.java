package com.lagunapools.lagunapools.utils;

import com.lagunapools.lagunapools.security.ApplicationUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;


/**
 * Created by Lazo on 9/16/24
 */

class LazoUtilsTest {

    @BeforeEach
    void setUp() {
        // Mock SecurityContext and Authentication for getCurrentApplicationUser and getCurrentApplicationUserId
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        ApplicationUser applicationUser = mock(ApplicationUser.class);

        Mockito.when(securityContext.getAuthentication()).thenReturn(authentication);
        Mockito.when(authentication.getPrincipal()).thenReturn(applicationUser);
        Mockito.when(applicationUser.getUserId()).thenReturn(1L);

        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testMostCommonListValue() {
        // Test with a list of strings
        List<String> list = Arrays.asList("apple", "banana", "apple", "orange", "banana", "banana");
        String mostCommon = LazoUtils.mostCommonListValue(list);
        assertEquals("banana", mostCommon);

        // Test with a list of integers
        List<Integer> numbers = Arrays.asList(1, 2, 3, 2, 2, 4, 3);
        Integer mostCommonNumber = LazoUtils.mostCommonListValue(numbers);
        assertEquals(2, mostCommonNumber);

        // Test with an empty list
        List<String> emptyList = Collections.emptyList();
        String resultForEmptyList = LazoUtils.mostCommonListValue(emptyList);
        assertNull(resultForEmptyList);
    }

    @Test
    void testGetCurrentApplicationUser() {
        ApplicationUser user = LazoUtils.getCurrentApplicationUser();
        assertEquals(1, user.getUserId());
    }

    @Test
    void testGetCurrentApplicationUserId() {
        var userId = LazoUtils.getCurrentApplicationUserId();
        assertEquals(1, userId);
    }

    @Test
    void testGetSortAsc() {
        Sort sort = LazoUtils.getSortAsc("name");
        assertEquals(Sort.by(Sort.Order.asc("name")), sort);
    }

    @Test
    void testGetSortDesc() {
        Sort sort = LazoUtils.getSortDesc("name");
        assertEquals(Sort.by(Sort.Order.desc("name")), sort);
    }
}
