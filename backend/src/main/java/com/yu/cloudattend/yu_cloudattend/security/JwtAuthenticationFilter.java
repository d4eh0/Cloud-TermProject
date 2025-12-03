package com.yu.cloudattend.yu_cloudattend.security;

import com.yu.cloudattend.yu_cloudattend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    
    private static final String COOKIE_NAME = "accessToken";
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 로그인 경로는 필터 통과
        if (request.getRequestURI().startsWith("/api/auth/login")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // 쿠키에서 JWT 토큰 추출
        String token = extractTokenFromCookie(request);
        
        if (token != null && jwtUtil.validateToken(token)) {
            try {
                // 토큰에서 사용자 정보 추출
                Long userId = jwtUtil.getUserIdFromToken(token);
                String studentId = jwtUtil.getStudentIdFromToken(token);
                
                // SecurityContext에 인증 정보 설정
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                        );
                
                // 추가 정보를 details에 저장
                authentication.setDetails(new UserDetails(userId, studentId));
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                // 토큰 파싱 실패 시 인증 실패 처리
                SecurityContextHolder.clearContext();
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * 쿠키에서 JWT 토큰 추출
     */
    private String extractTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
    
    /**
     * 사용자 상세 정보를 저장하는 클래스
     */
    public static class UserDetails {
        private final Long userId;
        private final String studentId;
        
        public UserDetails(Long userId, String studentId) {
            this.userId = userId;
            this.studentId = studentId;
        }
        
        public Long getUserId() {
            return userId;
        }
        
        public String getStudentId() {
            return studentId;
        }
    }
}

