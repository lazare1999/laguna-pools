package com.lagunapools.lagunapools.services;

import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;


/**
 * Created by Lazo on 9/26/24
 */

@Service
@AllArgsConstructor
public class RedisService {

    private StringRedisTemplate redisTemplate;

    private final static Long EXPIRES_IN_SECONDS = 300L;
    public static Long REFRESH_EXPIRES_IN_SECONDS = 60 * 60L;

    public void storeToken(String username, String token, boolean isAccessToken) {
        String key = buildRedisKey(username, isAccessToken);
        redisTemplate.opsForValue().set(key, token, isAccessToken ? EXPIRES_IN_SECONDS : REFRESH_EXPIRES_IN_SECONDS, TimeUnit.SECONDS);
    }

    public String getToken(String username, boolean isAccessToken) {
        String key = buildRedisKey(username, isAccessToken);
        return redisTemplate.opsForValue().get(key);
    }

    public void removeToken(String username, boolean isAccessToken) {
        String key = buildRedisKey(username, isAccessToken);
        redisTemplate.delete(key);
    }

    private String buildRedisKey(String username, boolean isAccessToken) {
        return isAccessToken ? "access-token:" + username : "refresh-token:" + username;
    }
}
