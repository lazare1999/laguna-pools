package com.lagunapools.lagunapools.utils;

import io.micrometer.common.lang.Nullable;
import io.micrometer.common.util.StringUtils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Objects;

/**
 * Created by Lazo on 9/11/24
 */

public class LazoDateUtil {

    private final static String DATE_FORMAT = "yyyy-MM-dd";
    public final static String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    @Nullable
    public static Date stringToDate(String date) {
        if (StringUtils.isEmpty(date)) return null;
        SimpleDateFormat formatter = new SimpleDateFormat(DATE_FORMAT);
        try {
            return formatter.parse(date);
        } catch (ParseException ignored) {

        }
        return null;
    }

    @Nullable
    public static LocalDate stringToLocalDate(String date) {
        if (StringUtils.isEmpty(date)) return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_FORMAT);
        try {
            return LocalDate.parse(date, formatter);
        } catch (Exception ignored) {

        }
        return null;
    }

    public static boolean isValidAnyDate(String... dates) {
        for (String date : dates) {
            if (isValidDate(date)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isValidAllDates(String... dates) {
        for (String date : dates) {
            if (!isValidDate(date)) {
                return false;
            }
        }
        return false;
    }

    public static boolean isValidDate(String dateString) {
        if (StringUtils.isEmpty(dateString)) { return false; }
        try {
            DateFormat df = new SimpleDateFormat(DATE_FORMAT);
            df.setLenient(false);
            df.parse(dateString);
            return true;
        } catch (ParseException e) {
            return false;
        }
    }

    public static String dateToString(Date date) {
        return dateToString(date, "yyyy-MM-dd");
    }

    public static String dateTimeToString(Date date) {
        return dateToString(date, "yyyy-MM-dd HH:MM:ss");
    }

    public static String dateToString(Date date, String format) {
        if (date == null) return null;
        SimpleDateFormat dt1 = new SimpleDateFormat(format);
        return dt1.format(date);
    }

    public static String dateToString(LocalDate date) {
        return dateToString(date, "yyyy-MM-dd");
    }

    public static String dateToString(LocalDate date, String format) {
        if (date == null) return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
        return date.format(formatter);
    }

    public static String monthToGeorgianOn(int month) {
        return switch (month) {
            case 1 -> "იანვრის";
            case 2 -> "თებერვლის";
            case 3 -> "მარტის";
            case 4 -> "აპრილის";
            case 5 -> "მაისის";
            case 6 -> "ივნისის";
            case 7 -> "ივლისის";
            case 8 -> "აგვისტოს";
            case 9 -> "სექტემბრის";
            case 10 -> "ოქტომბრის";
            case 11 -> "ნოემბრის";
            case 12 -> "დეკემბრის";
            default -> "";
        };
    }

    public static String monthToGeorgianFrom(int month) {
        return switch (month) {
            case 1 -> "იანვრიდან";
            case 2 -> "თებერვლიდან";
            case 3 -> "მარტიდან";
            case 4 -> "აპრილიდან";
            case 5 -> "მაისიდან";
            case 6 -> "ივნისიდან";
            case 7 -> "ივლისიდან";
            case 8 -> "აგვისტოდან";
            case 9 -> "სექტემბრიდან";
            case 10 -> "ოქტომბრიდან";
            case 11 -> "ნოემბრიდან";
            case 12 -> "დეკემბრიდან";
            default -> "";
        };
    }

    public static String monthToGeorgianTo(int month) {
        return switch (month) {
            case 1 -> "იანვრამდე";
            case 2 -> "თებერვლამდე";
            case 3 -> "მარტამდე";
            case 4 -> "აპრილამდე";
            case 5 -> "მაისამდე";
            case 6 -> "ივნისამდე";
            case 7 -> "ივლისამდე";
            case 8 -> "აგვისტომდე";
            case 9 -> "სექტემბრამდე";
            case 10 -> "ოქტომბრამდე";
            case 11 -> "ნოემბრამდე";
            case 12 -> "დეკემბრამდე";
            default -> "";
        };
    }

    public static LocalDate dateToLocalDate(Date date) {
        if (date == null) {return null;}
        return LocalDate.parse(dateToString(date));
    }

    public static LocalDateTime stringToLocalDateTime(String date) {
        if (StringUtils.isEmpty(date)) return null;
        LocalTime localTime = LocalTime.MIN;
        try {
            return LocalDateTime.of(Objects.requireNonNull(stringToLocalDate(date)), localTime);
        } catch (Exception ignored) {

        }
        return null;
    }

    public static LocalDateTime stringToLocalDateTime2(String date) {
        if (StringUtils.isEmpty(date)) return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        try {
            return LocalDateTime.parse(date, formatter);
        } catch (Exception ignored) {

        }
        return null;
    }
}
