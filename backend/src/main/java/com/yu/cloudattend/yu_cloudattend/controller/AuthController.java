package com.yu.cloudattend.yu_cloudattend.controller;

import com.yu.cloudattend.yu_cloudattend.dto.LoginRequest;
import com.yu.cloudattend.yu_cloudattend.dto.LoginResponse;
import com.yu.cloudattend.yu_cloudattend.dto.UserDto;
import com.yu.cloudattend.yu_cloudattend.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    private static final String COOKIE_NAME = "accessToken";

    @Value("${jwt.expiration:3600000}")
    private Long expiration;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {

        long start = System.currentTimeMillis();
        log.info("[AuthController] POST /api/auth/login - studentId={}", loginRequest.getStudentId());

        LoginResponse loginResponse = authService.login(
                loginRequest.getStudentId(),
                loginRequest.getPassword()
        );

        if (loginResponse.isSuccess()) {
            String token = loginResponse.getToken();

            Cookie cookie = new Cookie(COOKIE_NAME, token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge((int) (expiration / 1000));
            response.addCookie(cookie);

            log.info("[AuthController] 로그인 성공 - studentId={}, elapsed={}ms",
                    loginRequest.getStudentId(), System.currentTimeMillis() - start);
        } else {
            log.warn("[AuthController] 로그인 실패 - studentId={}, reason={}, elapsed={}ms",
                    loginRequest.getStudentId(), loginResponse.getMessage(), System.currentTimeMillis() - start);
        }

        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        long start = System.currentTimeMillis();
        log.info("[AuthController] GET /api/auth/me");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[AuthController] /me - 인증되지 않은 요청");
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "인증되지 않은 사용자입니다.");
            return ResponseEntity.status(401).body(response);
        }

        Long userId = (Long) authentication.getPrincipal();
        UserDto userDto = authService.getUserById(userId);

        if (userDto == null) {
            log.warn("[AuthController] /me - 사용자 정보 없음 userId={}", userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "사용자 정보를 찾을 수 없습니다.");
            return ResponseEntity.status(404).body(response);
        }

        log.info("[AuthController] /me 응답 - userId={}, elapsed={}ms", userId, System.currentTimeMillis() - start);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", userDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse response) {
        log.info("[AuthController] POST /api/auth/logout");

        Cookie cookie = new Cookie(COOKIE_NAME, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        log.info("[AuthController] 로그아웃 완료");
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        return ResponseEntity.ok(result);
    }
}
