package com.lagunapools.lagunapools.common.utils;

import lombok.Getter;

@Getter
public enum HoursEnum {
    HOUR_00("00:00"),
    HOUR_01("01:00"),
    HOUR_02("02:00"),
    HOUR_03("03:00"),
    HOUR_04("04:00"),
    HOUR_05("05:00"),
    HOUR_06("06:00"),
    HOUR_07("07:00"),
    HOUR_08("08:00"),
    HOUR_09("09:00"),
    HOUR_10("10:00"),
    HOUR_11("11:00"),
    HOUR_12("12:00"),
    HOUR_13("13:00"),
    HOUR_14("14:00"),
    HOUR_15("15:00"),
    HOUR_16("16:00"),
    HOUR_17("17:00"),
    HOUR_18("18:00"),
    HOUR_19("19:00"),
    HOUR_20("20:00"),
    HOUR_21("21:00"),
    HOUR_22("22:00"),
    HOUR_23("23:00");

    private final String value;

    HoursEnum(String value) {
        this.value = value;
    }

    public static HoursEnum fromValue(String value) {
        for (HoursEnum hour : HoursEnum.values()) {
            if (hour.value.equals(value)) {
                return hour;
            }
        }
        throw new IllegalArgumentException("Invalid hour: " + value);
    }
}
