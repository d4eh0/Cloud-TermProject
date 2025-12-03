package com.yu.cloudattend.yu_cloudattend.service;

import com.yu.cloudattend.yu_cloudattend.dto.AttendanceCheckRequest;
import com.yu.cloudattend.yu_cloudattend.dto.AttendanceCheckResponse;
import com.yu.cloudattend.yu_cloudattend.dto.AttendanceDetailDto;
import com.yu.cloudattend.yu_cloudattend.dto.AttendanceRecordDto;
import com.yu.cloudattend.yu_cloudattend.dto.AttendanceSessionDto;
import com.yu.cloudattend.yu_cloudattend.dto.CourseDto;
import com.yu.cloudattend.yu_cloudattend.dto.TodayLectureDto;
import com.yu.cloudattend.yu_cloudattend.entity.AttendanceLog;
import com.yu.cloudattend.yu_cloudattend.entity.ClassSession;
import com.yu.cloudattend.yu_cloudattend.entity.Course;
import com.yu.cloudattend.yu_cloudattend.entity.Student;
import com.yu.cloudattend.yu_cloudattend.entity.Takes;
import com.yu.cloudattend.yu_cloudattend.repository.AttendanceLogRepository;
import com.yu.cloudattend.yu_cloudattend.repository.ClassSessionRepository;
import com.yu.cloudattend.yu_cloudattend.repository.CourseRepository;
import com.yu.cloudattend.yu_cloudattend.repository.StudentRepository;
import com.yu.cloudattend.yu_cloudattend.repository.TakesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final StudentRepository studentRepository;
    private final TakesRepository takesRepository;
    private final ClassSessionRepository classSessionRepository;
    private final CourseRepository courseRepository;
    private final AttendanceLogRepository attendanceLogRepository;

    /**
     * 현재 로그인한 학생의 수강 과목 목록을 조회합니다.
     *
     * @param studentId 로그인한 학생의 PK (Student.id)
     * @return 수강 중인 과목 목록
     */
    public List<CourseDto> getMyCourses(Long studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);

        if (studentOpt.isEmpty()) {
            return List.of();
        }

        Student student = studentOpt.get();

        // 학생이 수강 중인 Takes 목록 조회
        List<Takes> takesList = takesRepository.findByStudent(student);

        // Takes -> Course -> CourseDto로 매핑
        return takesList.stream()
                .map(Takes::getCourse)
                .distinct()
                .map(course -> new CourseDto(
                        course.getId(),
                        course.getCourseName(),
                        course.getCourseCode()
                ))
                .collect(Collectors.toList());
    }

    /**
     * 오늘 날짜 기준으로, 현재 로그인한 학생의 수업 세션 목록을 조회합니다.
     * (1차 버전: 출석 상태는 모두 "미확인")
     */
    public List<TodayLectureDto> getTodayLectures(Long studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);

        if (studentOpt.isEmpty()) {
            return List.of();
        }

        Student student = studentOpt.get();

        // 학생이 수강 중인 과목 목록
        List<Takes> takesList = takesRepository.findByStudent(student);
        List<Course> courses = takesList.stream()
                .map(Takes::getCourse)
                .distinct()
                .collect(Collectors.toList());

        if (courses.isEmpty()) {
            return List.of();
        }

        LocalDate today = LocalDate.now();

        // 오늘 날짜의 수업 세션 조회
        List<ClassSession> sessions =
                classSessionRepository.findByCourseInAndSessionDate(courses, today);

        if (sessions.isEmpty()) {
            return List.of();
        }

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // ClassSession -> TodayLectureDto 매핑 (출석 로그 조회 포함)
        return sessions.stream()
                .map(session -> {
                    String date = session.getSessionDate().format(dateFormatter);
                    String time = session.getStartTime().format(timeFormatter)
                            + " ~ " + session.getEndTime().format(timeFormatter);

                    // 해당 학생의 해당 세션에 대한 출석 로그 조회
                    Optional<AttendanceLog> logOpt = attendanceLogRepository
                            .findFirstByStudentAndClassSession(student, session);

                    String attendanceStatus = "미확인";
                    String attendanceTime = null;

                    if (logOpt.isPresent()) {
                        AttendanceLog log = logOpt.get();
                        attendanceStatus = convertStatusToKorean(log.getStatus());
                        attendanceTime = log.getAttendanceTime().format(timeFormatter);
                    }

                    return new TodayLectureDto(
                            session.getId(),
                            session.getCourse().getCourseName(),
                            date,
                            time,
                            session.getCourse().getLocation(),
                            attendanceStatus,
                            attendanceTime
                    );
                })
                .collect(Collectors.toList());
    }

    /**
     * 특정 과목에 대한 현재 로그인한 학생의 출석 상세 내역을 조회합니다.
     *
     * @param studentId 로그인한 학생의 PK (Student.id)
     * @param courseId  조회할 과목 ID
     * @return 과목 정보 + 회차별 출석 기록
     */
    public AttendanceDetailDto getAttendanceDetail(Long studentId, Long courseId) {
        // 1) 학생 검증
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            return null;
        }
        Student student = studentOpt.get();

        // 2) 과목 검증
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return null;
        }
        Course course = courseOpt.get();

        // 3) 해당 학생 + 과목에 대한 모든 출석 로그 조회 (날짜 오름차순)
        List<AttendanceLog> logs =
                attendanceLogRepository.findByStudentAndClassSession_CourseOrderByClassSession_SessionDateAsc(
                        student,
                        course
                );

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // 기준 날짜: 2025-09-01 (월요일, 1주차 시작)
        LocalDate baseDate = LocalDate.of(2025, 9, 1);

        // 과목별 주당 수업 횟수 판단 (courseCode 기준)
        // 운영체제(1102), 컴퓨터구조(1103): 주 2회
        // 클라우드컴퓨팅(1104): 주 1회
        boolean isTwoSessionsPerWeek = "1102".equals(course.getCourseCode()) || "1103".equals(course.getCourseCode());

        // 4) AttendanceLog -> AttendanceRecordDto로 변환 (주차/차시 계산)
        List<AttendanceRecordDto> records = new java.util.ArrayList<>();

        for (AttendanceLog log : logs) {
            LocalDate sessionDate = log.getClassSession().getSessionDate();

            // 주차 계산: 기준 날짜로부터 몇 주차인지 (월요일 기준)
            long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(baseDate, sessionDate);
            int week = (int) (daysBetween / 7) + 1; // 1주차부터 시작

            int sessionInWeek;
            if (!isTwoSessionsPerWeek) {
                // 주 1회 과목(클라우드컴퓨팅)은 항상 1차시
                sessionInWeek = 1;
            } else {
                // 주 2회 과목: 요일 기준으로 1차시/2차시 결정
                // 운영체제(1102): 월(1) = 1차시, 수(3) = 2차시
                // 컴퓨터구조(1103): 화(2) = 1차시, 목(4) = 2차시
                java.time.DayOfWeek dayOfWeek = sessionDate.getDayOfWeek();
                if ("1102".equals(course.getCourseCode())) {
                    sessionInWeek = (dayOfWeek == java.time.DayOfWeek.MONDAY) ? 1 : 2;
                } else {
                    // 1103 (컴퓨터구조)
                    sessionInWeek = (dayOfWeek == java.time.DayOfWeek.TUESDAY) ? 1 : 2;
                }
            }

            String date = sessionDate.format(dateFormatter);
            String status = convertStatusToKorean(log.getStatus());
            String label = week + "-" + sessionInWeek + "차시";

            records.add(new AttendanceRecordDto(label, date, status));
        }

        // 5) 최종 DTO 구성
        AttendanceDetailDto detailDto = new AttendanceDetailDto();
        detailDto.setCourseId(course.getId());
        detailDto.setCourseName(course.getCourseName());
        detailDto.setCourseCode(course.getCourseCode());
        detailDto.setRecords(records);

        return detailDto;
    }

    private String convertStatusToKorean(AttendanceLog.AttendanceStatus status) {
        if (status == null) {
            return "미확인";
        }

        return switch (status) {
            case PRESENT -> "출석";
            case LATE -> "지각";
            case ABSENT -> "결석";
        };
    }

    /**
     * 출석 토큰으로 수업 세션 정보를 조회합니다.
     * 1차 버전: 토큰은 단순히 "mock-token-{sessionId}" 또는 "{sessionId}" 형식으로 가정합니다.
     */
    public AttendanceSessionDto getSessionByToken(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }

        // "mock-token-123" 형식이면 마지막 부분만 사용, 아니면 전체를 ID로 가정
        String[] parts = token.split("-");
        String idPart = parts[parts.length - 1];

        Long sessionId;
        try {
            sessionId = Long.parseLong(idPart);
        } catch (NumberFormatException e) {
            return null;
        }

        Optional<ClassSession> sessionOpt = classSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return null;
        }

        ClassSession session = sessionOpt.get();
        Course course = session.getCourse();

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        String date = session.getSessionDate().format(dateFormatter);
        String time = session.getStartTime().format(timeFormatter)
                + " ~ " + session.getEndTime().format(timeFormatter);

        // 1차 버전: 남은 출석 가능 시간은 일단 15분으로 고정
        int remainingMinutes = 15;

        return new AttendanceSessionDto(
                session.getId(),
                course.getCourseName(),
                date,
                time,
                course.getLocation(),
                remainingMinutes
        );
    }

    /**
     * 출석 체크 비즈니스 로직.
     * 1차 버전: 시간/위치/기기 검증 없이 무조건 "출석"으로 기록하거나 업데이트.
     */
    public AttendanceCheckResponse checkAttendance(Long studentId, AttendanceCheckRequest request) {
        // 1) 학생 검증
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            return null;
        }
        Student student = studentOpt.get();

        // 2) 수업 세션 검증
        if (request == null || request.getLectureId() == null) {
            return null;
        }

        Optional<ClassSession> sessionOpt = classSessionRepository.findById(request.getLectureId());
        if (sessionOpt.isEmpty()) {
            return null;
        }
        ClassSession session = sessionOpt.get();

        // 3) 기존 출석 로그 여부 확인 (학생 + 세션)
        Optional<AttendanceLog> existingLogOpt =
                attendanceLogRepository.findFirstByStudentAndClassSession(student, session);

        LocalDateTime now = LocalDateTime.now();

        AttendanceLog log;
        if (existingLogOpt.isPresent()) {
            // 이미 출석 기록이 있으면 출석 시간/위치만 업데이트 (상태는 그대로 두거나 PRESENT로 덮어씀)
            log = existingLogOpt.get();
            log.setAttendanceTime(now);
            log.setLatitude(request.getLatitude());
            log.setLongitude(request.getLongitude());
            log.setStatus(AttendanceLog.AttendanceStatus.PRESENT);
        } else {
            // 새 출석 로그 생성
            log = new AttendanceLog(
                    null,
                    student,
                    session,
                    AttendanceLog.AttendanceStatus.PRESENT,
                    now,
                    request.getLatitude(),
                    request.getLongitude()
            );
        }

        AttendanceLog saved = attendanceLogRepository.save(log);

        // 4) 응답 DTO로 변환
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        String attendanceTimeStr = saved.getAttendanceTime().format(timeFormatter);

        AttendanceCheckResponse.LocationInfo locationInfo =
                new AttendanceCheckResponse.LocationInfo(saved.getLatitude(), saved.getLongitude());

        return new AttendanceCheckResponse(
                saved.getId(),
                session.getId(),
                convertStatusToKorean(saved.getStatus()),
                attendanceTimeStr,
                locationInfo
        );
    }
}

