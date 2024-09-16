package com.lagunapools.lagunapools.utils;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Created by Lazo on 9/16/24
 */

public class ResponseUtils {

    private static <T> ResponseEntity<T> createResponse(T body, HttpStatus status) {
        return new ResponseEntity<>(body, new HttpHeaders(), status);
    }

    public static <T> ResponseEntity<T> badRequestResponse(T body) {
        return createResponse(body, HttpStatus.BAD_REQUEST);
    }

    public static <T> ResponseEntity<T> notFoundResponse(T body) {
        return createResponse(body, HttpStatus.NOT_FOUND);
    }

    public static <T> ResponseEntity<T> internalServerErrorResponse(T body) {
        return createResponse(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static <T> ResponseEntity<T> okResponse(T body) {
        return createResponse(body, HttpStatus.OK);
    }

    public static <T> ResponseEntity<T> forbiddenResponse(T body) {
        return createResponse(body, HttpStatus.FORBIDDEN);
    }

    public static <T> ResponseEntity<T> lockedResponse(T body) {
        return createResponse(body, HttpStatus.LOCKED);
    }

}