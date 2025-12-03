package com.yu.cloudattend.yu_cloudattend.controller;

import com.yu.cloudattend.yu_cloudattend.dto.LoginRequest;
import com.yu.cloudattend.yu_cloudattend.dto.LoginResponse;
import com.yu.cloudattend.yu_cloudattend.dto.UserDto;
import com.yu.cloudattend.yu_cloudattend.security.JwtAuthenticationFilter;
import com.yu.cloudattend.yu_cloudattend.service.AuthService;
import com.yu.cloudattend.yu_cloudattend.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    
    private static final String COOKIE_NAME = "accessToken";
    
    @Value("${jwt.expiration:3600000}") // 기본값 60분 (밀리초)
    private Long expiration;
    
    /**
     * 로그인 API
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {
        
        // 로그인 처리
        LoginResponse loginResponse = authService.login(
                loginRequest.getStudentId(),
                loginRequest.getPassword()
        );
        
        // 로그인 성공 시 JWT 토큰을 쿠키에 저장
        if (loginResponse.isSuccess()) {
            // 토큰 생성 (AuthService에서 이미 생성했지만, 여기서 다시 생성)
            // 실제로는 AuthService에서 토큰을 반환하도록 수정하는 것이 좋지만,
            // 일단 여기서 생성
            String token = jwtUtil.generateToken(
                    loginResponse.getUser().getId(),
                    loginResponse.getUser().getStudentId()
            );
            
            // HttpOnly + Secure 쿠키 설정
            Cookie cookie = new Cookie(COOKIE_NAME, token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // 로컬 개발 시 false, 프로덕션에서는 true
            cookie.setPath("/");
            cookie.setMaxAge((int) (expiration / 1000)); // 초 단위로 변환
            // SameSite 설정은 Servlet API 버전에 따라 다를 수 있음
            response.addCookie(cookie);
        }
        
        return ResponseEntity.ok(loginResponse);
    }
    
    /**
     * 현재 로그인한 사용자 정보 조회 API
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "인증되지 않은 사용자입니다.");
            return ResponseEntity.status(401).body(response);
        }
        
        // SecurityContext에서 사용자 ID 추출
        Long userId = (Long) authentication.getPrincipal();
        
        // 사용자 정보 조회
        UserDto userDto = authService.getUserById(userId);
        
        if (userDto == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "사용자 정보를 찾을 수 없습니다.");
            return ResponseEntity.status(404).body(response);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", userDto);
        
        return ResponseEntity.ok(response);
    }
}

