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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private static final Logger log = LoggerFactory.getLogger(AttendanceService.class);

    private final StudentRepository studentRepository;
    private final TakesRepository takesRepository;
    private final ClassSessionRepository classSessionRepository;
    private final CourseRepository courseRepository;
    private final AttendanceLogRepository attendanceLogRepository;

    public List<CourseDto> getMyCourses(Long studentId) {
        log.debug("[AttendanceService] getMyCourses - studentId={}", studentId);

        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            log.warn("[AttendanceService] getMyCourses - 학생 없음 studentId={}", studentId);
            return List.of();
        }

        Student student = studentOpt.get();
        List<Takes> takesList = takesRepository.findByStudent(student);

        List<CourseDto> result = takesList.stream()
                .map(Takes::getCourse)
                .distinct()
                .map(course -> new CourseDto(
                        course.getId(),
                        course.getCourseName(),
                        course.getCourseCode()
                ))
                .collect(Collectors.toList());

        log.debug("[AttendanceService] getMyCourses 완료 - studentId={}, courses={}", studentId, result.size());
        return result;
    }

    public List<TodayLectureDto> getTodayLectures(Long studentId) {
        log.info("[AttendanceService] getTodayLectures - studentId={}", studentId);

        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            log.warn("[AttendanceService] getTodayLectures - 학생 없음 studentId={}", studentId);
            return List.of();
        }

        Student student = studentOpt.get();
        List<Takes> takesList = takesRepository.findByStudent(student);
        List<Course> courses = takesList.stream()
                .map(Takes::getCourse)
                .distinct()
                .collect(Collectors.toList());

        if (courses.isEmpty()) {
            log.info("[AttendanceService] getTodayLectures - 수강 과목 없음 studentId={}", studentId);
            return List.of();
        }

        LocalDate today = LocalDate.now();
        log.info("[AttendanceService] getTodayLectures - 오늘 날짜={}, studentId={}", today, studentId);

        List<ClassSession> sessions =
                classSessionRepository.findByCourseInAndSessionDate(courses, today);

        if (sessions.isEmpty()) {
            log.info("[AttendanceService] getTodayLectures - 오늘 수업 없음 studentId={}", studentId);
            return List.of();
        }

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return sessions.stream()
                .map(session -> {
                    String date = session.getSessionDate().format(dateFormatter);
                    String time = session.getStartTime().format(timeFormatter)
                            + " ~ " + session.getEndTime().format(timeFormatter);

                    Optional<AttendanceLog> logOpt = attendanceLogRepository
                            .findFirstByStudentAndClassSession(student, session);

                    String attendanceStatus = "미확인";
                    String attendanceTime = null;

                    if (logOpt.isPresent()) {
                        AttendanceLog logEntry = logOpt.get();
                        attendanceStatus = convertStatusToKorean(logEntry.getStatus());
                        attendanceTime = logEntry.getAttendanceTime().format(timeFormatter);
                    }

                    return new TodayLectureDto(
                            session.getId(),
                            session.getCourse().getId(),
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

    public AttendanceDetailDto getAttendanceDetail(Long studentId, Long courseId) {
        log.info("[AttendanceService] getAttendanceDetail - studentId={}, courseId={}", studentId, courseId);

        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            log.warn("[AttendanceService] getAttendanceDetail - 학생 없음 studentId={}", studentId);
            return null;
        }
        Student student = studentOpt.get();

        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            log.warn("[AttendanceService] getAttendanceDetail - 과목 없음 courseId={}", courseId);
            return null;
        }
        Course course = courseOpt.get();

        // 세션 전체 조회 (과거 + 오늘 + 미래 모두)
        List<ClassSession> sessions = classSessionRepository.findByCourseOrderBySessionDateAsc(course);

        // 출석 로그를 sessionId → log 맵으로 변환
        List<AttendanceLog> logs =
                attendanceLogRepository.findByStudentAndClassSession_CourseOrderByClassSession_SessionDateAsc(
                        student, course);
        java.util.Map<Long, AttendanceLog> logBySessionId = new java.util.HashMap<>();
        for (AttendanceLog logEntry : logs) {
            logBySessionId.put(logEntry.getClassSession().getId(), logEntry);
        }

        log.debug("[AttendanceService] getAttendanceDetail - 전체 세션={}, 출석 로그={}", sessions.size(), logs.size());

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        boolean isTwoSessionsPerWeek = "1102".equals(course.getCourseCode()) || "1103".equals(course.getCourseCode());

        // 날짜 기준 중복 세션 제거 (오늘 데모 세션과 정규 세션 겹침 방지) — 날짜당 첫 번째 세션만 유지
        java.util.Map<LocalDate, ClassSession> uniqueByDate = new java.util.LinkedHashMap<>();
        for (ClassSession session : sessions) {
            uniqueByDate.putIfAbsent(session.getSessionDate(), session);
        }
        List<ClassSession> dedupSessions = new java.util.ArrayList<>(uniqueByDate.values());

        // 순서대로 카운팅해서 차시 표기 생성
        List<AttendanceRecordDto> records = new java.util.ArrayList<>();
        if (isTwoSessionsPerWeek) {
            int week = 1;
            int sessionInWeek = 1;
            for (ClassSession session : dedupSessions) {
                String label = week + "-" + sessionInWeek + "차시";
                String date = session.getSessionDate().format(dateFormatter);
                AttendanceLog logEntry = logBySessionId.get(session.getId());
                String status = (logEntry != null) ? convertStatusToKorean(logEntry.getStatus()) : "미확인";
                records.add(new AttendanceRecordDto(label, date, status));

                if (sessionInWeek == 2) { week++; sessionInWeek = 1; }
                else { sessionInWeek++; }
            }
        } else {
            int count = 1;
            for (ClassSession session : dedupSessions) {
                String label = count + "차시";
                String date = session.getSessionDate().format(dateFormatter);
                AttendanceLog logEntry = logBySessionId.get(session.getId());
                String status = (logEntry != null) ? convertStatusToKorean(logEntry.getStatus()) : "미확인";
                records.add(new AttendanceRecordDto(label, date, status));
                count++;
            }
        }

        AttendanceDetailDto detailDto = new AttendanceDetailDto();
        detailDto.setCourseId(course.getId());
        detailDto.setCourseName(course.getCourseName());
        detailDto.setCourseCode(course.getCourseCode());
        detailDto.setRecords(records);

        log.info("[AttendanceService] getAttendanceDetail 완료 - courseId={}, records={}", courseId, records.size());
        return detailDto;
    }

    public AttendanceSessionDto getSessionByToken(String token) {
        log.info("[AttendanceService] getSessionByToken - token={}", token);

        if (token == null || token.isBlank()) {
            log.warn("[AttendanceService] getSessionByToken - 토큰 없음");
            return null;
        }

        String[] parts = token.split("-");
        String idPart = parts[parts.length - 1];

        Long sessionId;
        try {
            sessionId = Long.parseLong(idPart);
        } catch (NumberFormatException e) {
            log.warn("[AttendanceService] getSessionByToken - 토큰 파싱 실패 token={}", token, e);
            return null;
        }

        Optional<ClassSession> sessionOpt = classSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            log.warn("[AttendanceService] getSessionByToken - 세션 없음 sessionId={}", sessionId);
            return null;
        }

        ClassSession session = sessionOpt.get();
        Course course = session.getCourse();

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        String date = session.getSessionDate().format(dateFormatter);
        String time = session.getStartTime().format(timeFormatter)
                + " ~ " + session.getEndTime().format(timeFormatter);

        int remainingMinutes = 15;

        log.info("[AttendanceService] getSessionByToken 완료 - sessionId={}, course={}", sessionId, course.getCourseName());
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
     * 오늘 수업 중 현재 출석 가능한 세션 자동 조회.
     * 출석 가능 조건: 수업 시작 10분 전 ~ 수업 시작 후 20분 이내 & 출석 로그 없음
     */
    public AttendanceSessionDto getAvailableSession(Long studentId) {
        log.info("[AttendanceService] getAvailableSession - studentId={}", studentId);

        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) return null;
        Student student = studentOpt.get();

        List<Takes> takesList = takesRepository.findByStudent(student);
        List<Course> courses = takesList.stream()
                .map(Takes::getCourse)
                .distinct()
                .collect(Collectors.toList());
        if (courses.isEmpty()) return null;

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<ClassSession> sessions = classSessionRepository.findByCourseInAndSessionDate(courses, today);

        // 출석 가능 윈도우: 시작 10분 전 ~ 시작 후 20분
        ClassSession available = sessions.stream()
                .filter(s -> {
                    LocalTime windowStart = s.getStartTime().minusMinutes(10);
                    LocalTime windowEnd   = s.getStartTime().plusMinutes(20);
                    return !now.isBefore(windowStart) && !now.isAfter(windowEnd);
                })
                .filter(s -> attendanceLogRepository.findFirstByStudentAndClassSession(student, s).isEmpty())
                .findFirst()
                .orElse(null);

        if (available == null) {
            log.info("[AttendanceService] getAvailableSession - 출석 가능 세션 없음 studentId={}", studentId);
            return null;
        }

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        long remaining = Duration.between(now, available.getStartTime().plusMinutes(20)).toMinutes();

        log.info("[AttendanceService] getAvailableSession - 세션 발견 sessionId={}, course={}",
                available.getId(), available.getCourse().getCourseName());

        return new AttendanceSessionDto(
                available.getId(),
                available.getCourse().getCourseName(),
                available.getSessionDate().format(dateFormatter),
                available.getStartTime().format(timeFormatter) + " ~ " + available.getEndTime().format(timeFormatter),
                available.getCourse().getLocation(),
                (int) Math.max(remaining, 0)
        );
    }

    public AttendanceCheckResponse checkAttendance(Long studentId, AttendanceCheckRequest request) {
        log.info("[AttendanceService] checkAttendance - studentId={}, lectureId={}, lat={}, lng={}",
                studentId, request.getLectureId(), request.getLatitude(), request.getLongitude());

        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            log.warn("[AttendanceService] checkAttendance - 학생 없음 studentId={}", studentId);
            return null;
        }
        Student student = studentOpt.get();

        if (request == null || request.getLectureId() == null) {
            log.warn("[AttendanceService] checkAttendance - lectureId 없음");
            return null;
        }

        Optional<ClassSession> sessionOpt = classSessionRepository.findById(request.getLectureId());
        if (sessionOpt.isEmpty()) {
            log.warn("[AttendanceService] checkAttendance - 세션 없음 lectureId={}", request.getLectureId());
            return null;
        }
        ClassSession session = sessionOpt.get();

        Optional<AttendanceLog> existingLogOpt =
                attendanceLogRepository.findFirstByStudentAndClassSession(student, session);

        LocalDateTime now = LocalDateTime.now();
        AttendanceLog logEntry;

        if (existingLogOpt.isPresent()) {
            log.info("[AttendanceService] checkAttendance - 기존 로그 업데이트 studentId={}, sessionId={}",
                    studentId, session.getId());
            logEntry = existingLogOpt.get();
            logEntry.setAttendanceTime(now);
            logEntry.setLatitude(request.getLatitude());
            logEntry.setLongitude(request.getLongitude());
            logEntry.setStatus(AttendanceLog.AttendanceStatus.PRESENT);
        } else {
            log.info("[AttendanceService] checkAttendance - 신규 로그 생성 studentId={}, sessionId={}",
                    studentId, session.getId());
            logEntry = new AttendanceLog(
                    null,
                    student,
                    session,
                    AttendanceLog.AttendanceStatus.PRESENT,
                    now,
                    request.getLatitude(),
                    request.getLongitude()
            );
        }

        AttendanceLog saved = attendanceLogRepository.save(logEntry);
        log.info("[AttendanceService] checkAttendance 완료 - logId={}, status={}", saved.getId(), saved.getStatus());

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

    private String convertStatusToKorean(AttendanceLog.AttendanceStatus status) {
        if (status == null) return "미확인";
        return switch (status) {
            case PRESENT -> "출석";
            case LATE -> "지각";
            case ABSENT -> "결석";
        };
    }
}
