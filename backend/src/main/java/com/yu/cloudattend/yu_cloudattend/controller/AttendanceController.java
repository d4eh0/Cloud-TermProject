package com.yu.cloudattend.yu_cloudattend.controller;

import com.yu.cloudattend.yu_cloudattend.dto.AttendanceCheckRequest;
import com.yu.cloudattend.yu_cloudattend.dto.AttendanceCheckResponse;
import com.yu.cloudattend.yu_cloudattend.dto.AttendanceDetailDto;
import com.yu.cloudattend.yu_cloudattend.dto.AttendanceSessionDto;
import com.yu.cloudattend.yu_cloudattend.dto.CourseDto;
import com.yu.cloudattend.yu_cloudattend.dto.TodayLectureDto;
import com.yu.cloudattend.yu_cloudattend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private static final Logger log = LoggerFactory.getLogger(AttendanceController.class);

    private final AttendanceService attendanceService;

    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getMyCourses() {
        long start = System.currentTimeMillis();
        log.info("[AttendanceController] GET /api/attendance/history");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[AttendanceController] /history - 인증 실패");
            return unauthorized();
        }

        Long userId = (Long) authentication.getPrincipal();
        List<CourseDto> courses = attendanceService.getMyCourses(userId);

        log.info("[AttendanceController] /history 응답 - userId={}, courses={}, elapsed={}ms",
                userId, courses.size(), System.currentTimeMillis() - start);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", courses);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getTodayLectures() {
        long start = System.currentTimeMillis();
        log.info("[AttendanceController] GET /api/attendance/today");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[AttendanceController] /today - 인증 실패");
            return unauthorized();
        }

        Long userId = (Long) authentication.getPrincipal();
        List<TodayLectureDto> lectures = attendanceService.getTodayLectures(userId);

        log.info("[AttendanceController] /today 응답 - userId={}, lectures={}, elapsed={}ms",
                userId, lectures.size(), System.currentTimeMillis() - start);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", lectures);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/detail/{courseId}")
    public ResponseEntity<Map<String, Object>> getAttendanceDetail(@PathVariable Long courseId) {
        long start = System.currentTimeMillis();
        log.info("[AttendanceController] GET /api/attendance/detail/{}", courseId);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[AttendanceController] /detail/{} - 인증 실패", courseId);
            return unauthorized();
        }

        Long userId = (Long) authentication.getPrincipal();
        AttendanceDetailDto detail = attendanceService.getAttendanceDetail(userId, courseId);

        if (detail == null) {
            log.warn("[AttendanceController] /detail/{} - 데이터 없음 userId={}", courseId, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "해당 과목의 출석 정보를 찾을 수 없습니다.");
            return ResponseEntity.status(404).body(response);
        }

        log.info("[AttendanceController] /detail/{} 응답 - userId={}, elapsed={}ms",
                courseId, userId, System.currentTimeMillis() - start);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", detail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available")
    public ResponseEntity<Map<String, Object>> getAvailableSession() {
        long start = System.currentTimeMillis();
        log.info("[AttendanceController] GET /api/attendance/available");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[AttendanceController] /available - 인증 실패");
            return unauthorized();
        }

        Long userId = (Long) authentication.getPrincipal();
        AttendanceSessionDto sessionDto = attendanceService.getAvailableSession(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", sessionDto); // null이면 출석 가능 세션 없음

        log.info("[AttendanceController] /available 응답 - userId={}, found={}, elapsed={}ms",
                userId, sessionDto != null, System.currentTimeMillis() - start);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session")
    public ResponseEntity<Map<String, Object>> getSessionByToken(@RequestParam("token") String token) {
        long start = System.currentTimeMillis();
        log.info("[AttendanceController] GET /api/attendance/session?token={}", token);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[AttendanceController] /session - 인증 실패");
            return unauthorized();
        }

        AttendanceSessionDto sessionDto = attendanceService.getSessionByToken(token);

        if (sessionDto == null) {
            log.warn("[AttendanceController] /session - 토큰 유효하지 않음 token={}", token);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "유효하지 않은 출석 토큰이거나 세션 정보를 찾을 수 없습니다.");
            return ResponseEntity.status(404).body(response);
        }

        log.info("[AttendanceController] /session 응답 - sessionId={}, elapsed={}ms",
                sessionDto.getId(), System.currentTimeMillis() - start);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", sessionDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check")
    public ResponseEntity<Map<String, Object>> checkAttendance(@RequestBody AttendanceCheckRequest request) {
        long start = System.currentTimeMillis();
        log.info("[AttendanceController] POST /api/attendance/check - lectureId={}, lat={}, lng={}",
                request.getLectureId(), request.getLatitude(), request.getLongitude());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("[AttendanceController] /check - 인증 실패");
            return unauthorized();
        }

        Long userId = (Long) authentication.getPrincipal();
        AttendanceCheckResponse checkResponse = attendanceService.checkAttendance(userId, request);

        if (checkResponse == null) {
            log.warn("[AttendanceController] /check - 출석 실패 userId={}, lectureId={}", userId, request.getLectureId());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "출석 체크에 실패했습니다. 수업 정보를 확인해주세요.");
            return ResponseEntity.status(400).body(response);
        }

        log.info("[AttendanceController] /check 완료 - userId={}, status={}, elapsed={}ms",
                userId, checkResponse.getStatus(), System.currentTimeMillis() - start);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", checkResponse);
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<Map<String, Object>> unauthorized() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "인증되지 않은 사용자입니다.");
        return ResponseEntity.status(401).body(response);
    }
}
