package com.yu.cloudattend.yu_cloudattend.service;

import com.yu.cloudattend.yu_cloudattend.dto.AttendanceDetailDto;
import com.yu.cloudattend.yu_cloudattend.dto.AttendanceRecordDto;
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

        // ClassSession -> TodayLectureDto 매핑
        return sessions.stream()
                .map(session -> {
                    String date = session.getSessionDate().format(dateFormatter);
                    String time = session.getStartTime().format(timeFormatter)
                            + " ~ " + session.getEndTime().format(timeFormatter);

                    return new TodayLectureDto(
                            session.getId(),
                            session.getCourse().getCourseName(),
                            date,
                            time,
                            session.getCourse().getLocation(),
                            "미확인",   // 1차 버전: 항상 미확인
                            null        // 아직 출석시간 없음
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

        // 4) AttendanceLog -> AttendanceRecordDto로 변환
        List<AttendanceRecordDto> records = logs.stream()
                .map(log -> {
                    String date = log.getClassSession().getSessionDate().format(dateFormatter);
                    String status = convertStatusToKorean(log.getStatus());
                    // 간단히 n주차 라벨 대신 날짜 기반 한 줄 정보만 제공
                    String label = date;
                    return new AttendanceRecordDto(label, date, status);
                })
                .collect(Collectors.toList());

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
}

