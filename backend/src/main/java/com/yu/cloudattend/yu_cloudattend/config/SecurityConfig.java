package com.yu.cloudattend.yu_cloudattend.config;

import com.yu.cloudattend.yu_cloudattend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 비활성화 (REST API이므로)
            .csrf(csrf -> csrf.disable())
            
            // 세션 사용 안 함 (stateless)
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // CORS 설정
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 요청 권한 설정
            .authorizeHttpRequests(auth -> auth
                    // 로그인 경로는 인증 없이 접근 가능
                    .requestMatchers("/api/auth/login").permitAll()
                    // 나머지 경로는 인증 필요
                    .anyRequest().authenticated()
            )
            
            // JWT 인증 필터 추가
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    /**
     * CORS 설정
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 프론트엔드 origin 허용 (로컬 개발용)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",  // Vite 기본 포트
                "http://localhost:3000",  // React 기본 포트
                "http://localhost:8080"   // 다른 포트
        ));
        
        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // 허용할 헤더
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // 쿠키 포함 허용 (credentials: true)
        configuration.setAllowCredentials(true);
        
        // preflight 요청 캐시 시간
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}

