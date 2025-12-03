package com.yu.cloudattend.yu_cloudattend.controller;

import com.yu.cloudattend.yu_cloudattend.dto.AttendanceDetailDto;
import com.yu.cloudattend.yu_cloudattend.dto.AttendanceSessionDto;
import com.yu.cloudattend.yu_cloudattend.dto.CourseDto;
import com.yu.cloudattend.yu_cloudattend.dto.TodayLectureDto;
import com.yu.cloudattend.yu_cloudattend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    /**
     * 오늘 날짜 기준, 현재 로그인한 학생의 수업 목록 조회
     */
    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getTodayLectures() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "인증되지 않은 사용자입니다.");
            return ResponseEntity.status(401).body(response);
        }

        Long userId = (Long) authentication.getPrincipal();

        List<TodayLectureDto> lectures = attendanceService.getTodayLectures(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", lectures);

        return ResponseEntity.ok(response);
    }

    /**
     * 특정 과목에 대한 현재 로그인한 학생의 출석 상세 정보 조회
     */
    @GetMapping("/detail/{courseId}")
    public ResponseEntity<Map<String, Object>> getAttendanceDetail(@PathVariable Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "인증되지 않은 사용자입니다.");
            return ResponseEntity.status(401).body(response);
        }

        Long userId = (Long) authentication.getPrincipal();

        AttendanceDetailDto detail = attendanceService.getAttendanceDetail(userId, courseId);

        if (detail == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "해당 과목의 출석 정보를 찾을 수 없습니다.");
            return ResponseEntity.status(404).body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", detail);

        return ResponseEntity.ok(response);
    }

    /**
     * 출석 토큰으로 수업 세션 정보 조회
     * 1차 버전: 토큰은 단순히 "mock-token-{sessionId}" 또는 "{sessionId}" 형식으로 가정
     */
    @GetMapping("/session")
    public ResponseEntity<Map<String, Object>> getSessionByToken(@RequestParam("token") String token) {
        // 로그인 여부는 일단 다른 출석 API와 동일하게 체크 (쿠키 기반 세션)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "인증되지 않은 사용자입니다.");
            return ResponseEntity.status(401).body(response);
        }

        AttendanceSessionDto sessionDto = attendanceService.getSessionByToken(token);

        if (sessionDto == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "유효하지 않은 출석 토큰이거나 세션 정보를 찾을 수 없습니다.");
            return ResponseEntity.status(404).body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", sessionDto);

        return ResponseEntity.ok(response);
    }
}


