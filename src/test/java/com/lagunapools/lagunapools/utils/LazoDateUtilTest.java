package com.lagunapools.lagunapools.utils;

import org.junit.jupiter.api.Test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;


/**
 * Created by Lazo on 9/16/24
 */

class LazoDateUtilTest {

    @Test
    void testStringToDate() {
        // Valid date string
        String dateString = "2024-09-11";
        Date date = LazoDateUtil.stringToDate(dateString);
        assertNotNull(date);
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        assertEquals(dateString, formatter.format(date));

        // Invalid date string
        assertNull(LazoDateUtil.stringToDate("invalid-date"));

        // Null and empty string
        assertNull(LazoDateUtil.stringToDate(null));
        assertNull(LazoDateUtil.stringToDate(""));
    }

    @Test
    void testStringToLocalDate() {
        // Valid date string
        String dateString = "2024-09-11";
        LocalDate localDate = LazoDateUtil.stringToLocalDate(dateString);
        assertNotNull(localDate);
        assertEquals(LocalDate.of(2024, 9, 11), localDate);

        // Invalid date string
        assertNull(LazoDateUtil.stringToLocalDate("invalid-date"));

        // Null and empty string
        assertNull(LazoDateUtil.stringToLocalDate(null));
        assertNull(LazoDateUtil.stringToLocalDate(""));
    }

    @Test
    void testIsValidAnyDate() {
        // Valid dates
        assertTrue(LazoDateUtil.isValidAnyDate("2024-09-11", "invalid-date"));

        // All invalid dates
        assertFalse(LazoDateUtil.isValidAnyDate("invalid-date1", "invalid-date2"));
    }

    @Test
    void testIsValidAllDates() {
        // All valid dates
        assertTrue(LazoDateUtil.isValidAllDates("2024-09-11", "2024-09-12"));

        // Some invalid dates
        assertFalse(LazoDateUtil.isValidAllDates("2024-09-11", "invalid-date"));
    }

    @Test
    void testIsValidDate() {
        // Valid date
        assertTrue(LazoDateUtil.isValidDate("2024-09-11"));

        // Invalid date
        assertFalse(LazoDateUtil.isValidDate("invalid-date"));

        // Null and empty string
        assertFalse(LazoDateUtil.isValidDate(null));
        assertFalse(LazoDateUtil.isValidDate(""));
    }

    @Test
    void testDateToString() throws ParseException {
        // Test with Date object
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date = formatter.parse("2024-09-11");
        assertEquals("2024-09-11", LazoDateUtil.dateToString(date));

        // Test with LocalDate object
        LocalDate localDate = LocalDate.of(2024, 9, 11);
        assertEquals("2024-09-11", LazoDateUtil.dateToString(localDate));
    }

    @Test
    void testMonthToGeorgianOn() {
        // Test each month translation
        assertEquals("იანვრის", LazoDateUtil.monthToGeorgianOn(1));
        assertEquals("მარტის", LazoDateUtil.monthToGeorgianOn(3));
        assertEquals("დეკემბრის", LazoDateUtil.monthToGeorgianOn(12));

        // Test invalid month
        assertEquals("", LazoDateUtil.monthToGeorgianOn(13));
    }

    @Test
    void testMonthToGeorgianFrom() {
        // Test each month translation
        assertEquals("იანვრიდან", LazoDateUtil.monthToGeorgianFrom(1));
        assertEquals("მარტიდან", LazoDateUtil.monthToGeorgianFrom(3));
        assertEquals("დეკემბრიდან", LazoDateUtil.monthToGeorgianFrom(12));

        // Test invalid month
        assertEquals("", LazoDateUtil.monthToGeorgianFrom(13));
    }

    @Test
    void testMonthToGeorgianTo() {
        // Test each month translation
        assertEquals("იანვრამდე", LazoDateUtil.monthToGeorgianTo(1));
        assertEquals("მარტამდე", LazoDateUtil.monthToGeorgianTo(3));
        assertEquals("დეკემბრამდე", LazoDateUtil.monthToGeorgianTo(12));

        // Test invalid month
        assertEquals("", LazoDateUtil.monthToGeorgianTo(13));
    }

    @Test
    void testDateToLocalDate() throws ParseException {
        // Valid Date object
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date = formatter.parse("2024-09-11");
        LocalDate localDate = LazoDateUtil.dateToLocalDate(date);
        assertEquals(LocalDate.of(2024, 9, 11), localDate);
    }

    @Test
    void testStringToLocalDateTime() {
        // Valid date string
        String dateString = "2024-09-11";
        LocalDateTime localDateTime = LazoDateUtil.stringToLocalDateTime(dateString);
        assertNotNull(localDateTime);
        assertEquals(LocalDateTime.of(2024, 9, 11, 0, 0), localDateTime);

        // Invalid date string
        assertNull(LazoDateUtil.stringToLocalDateTime("invalid-date"));

        // Null and empty string
        assertNull(LazoDateUtil.stringToLocalDateTime(null));
        assertNull(LazoDateUtil.stringToLocalDateTime(""));
    }

    @Test
    void testStringToLocalDateTime2() {
        // Valid date string with time
        String dateString = "2024-09-11 10:15:30.123";
        LocalDateTime localDateTime = LazoDateUtil.stringToLocalDateTime2(dateString);
        assertNotNull(localDateTime);
        assertEquals(LocalDateTime.of(2024, 9, 11, 10, 15, 30, 123_000_000), localDateTime);

        // Invalid date string
        assertNull(LazoDateUtil.stringToLocalDateTime2("invalid-date"));

        // Null and empty string
        assertNull(LazoDateUtil.stringToLocalDateTime2(null));
        assertNull(LazoDateUtil.stringToLocalDateTime2(""));
    }
}