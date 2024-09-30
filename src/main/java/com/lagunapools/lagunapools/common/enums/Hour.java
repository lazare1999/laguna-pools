package com.lagunapools.lagunapools.common.enums;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Hour {
    //    HOUR_00("00:00"),
//    HOUR_01("01:00"),
//    HOUR_02("02:00"),
//    HOUR_03("03:00"),
//    HOUR_04("04:00"),
//    HOUR_05("05:00"),
//    HOUR_06("06:00"),
//    HOUR_07("07:00"),
//    HOUR_08("08:00"),
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
    HOUR_21("21:00");
//    HOUR_22("22:00"),
//    HOUR_23("23:00");

    private final String hour;

    public static Hour fromValue(String value) {
        for (Hour hourEnum : Hour.values()) {
            if (hourEnum.hour.equals(value)) {
                return hourEnum;
            }
        }
        throw new IllegalArgumentException("No enum constant with value " + value);
    }
}
