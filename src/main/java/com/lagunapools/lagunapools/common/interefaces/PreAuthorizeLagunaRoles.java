package com.lagunapools.lagunapools.common.interefaces;

import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@PreAuthorize("hasAnyRole('ROLE_LAGUNA_ADMIN', 'ROLE_LAGUNA')")
public @interface PreAuthorizeLagunaRoles {
}
