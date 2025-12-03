package com.yu.cloudattend.yu_cloudattend.controller;

import com.yu.cloudattend.yu_cloudattend.dto.CourseDto;
import com.yu.cloudattend.yu_cloudattend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    /**
     * 현재 로그인한 학생의 수강 과목 목록 조회
     */
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getMyCourses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "인증되지 않은 사용자입니다.");
            return ResponseEntity.status(401).body(response);
        }

        Long userId = (Long) authentication.getPrincipal();

        List<CourseDto> courses = attendanceService.getMyCourses(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", courses);

        return ResponseEntity.ok(response);
    }
}


