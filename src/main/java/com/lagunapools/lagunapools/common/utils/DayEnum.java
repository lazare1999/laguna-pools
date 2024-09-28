package com.lagunapools.lagunapools.common.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DayEnum {
    SUNDAY("SUNDAY"),
    MONDAY("MONDAY"),
    TUESDAY("TUESDAY"),
    WEDNESDAY("WEDNESDAY"),
    THURSDAY("THURSDAY"),
    FRIDAY("FRIDAY"),
    SATURDAY("SATURDAY");

    private final String value;

    /**
     * Converts a string to the corresponding DayEnum value.
     *
     * @param value the string representation of the day
     * @return the corresponding DayEnum
     * @throws IllegalArgumentException if the value doesn't match any day
     */
    public static DayEnum fromValue(String value) {
        for (DayEnum day : DayEnum.values()) {
            if (day.value.equalsIgnoreCase(value)) {
                return day;
            }
        }
        throw new IllegalArgumentException("Invalid day: " + value);
    }
}
