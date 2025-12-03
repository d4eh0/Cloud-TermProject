package com.yu.cloudattend.yu_cloudattend.config;

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
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final TakesRepository takesRepository;
    private final ClassSessionRepository classSessionRepository;
    private final AttendanceLogRepository attendanceLogRepository;

    @Bean
    public ApplicationRunner initData() {
        return args -> {
            // 1) studentId=22211111 학생 조회 또는 생성
            Student student = studentRepository.findByStudentId("22211111")
                    .orElseGet(() -> {
                        Student s = new Student();
                        s.setStudentId("22211111");
                        s.setPassword("1q2w3e4r!");
                        s.setName("김똘똘");
                        s.setDepartment("컴퓨터공학과");
                        return studentRepository.save(s);
                    });

            // 2) 과목(운영체제, 컴퓨터구조, 클라우드컴퓨팅) 조회 또는 생성
            Course os = courseRepository.findByCourseCode("1102")
                    .orElseGet(() -> courseRepository.save(
                            new Course(null, "운영체제", "1102", "IT관(E21-114)")
                    ));

            Course arch = courseRepository.findByCourseCode("1103")
                    .orElseGet(() -> courseRepository.save(
                            new Course(null, "컴퓨터구조", "1103", "IT관(E21-114)")
                    ));

            Course cloud = courseRepository.findByCourseCode("1104")
                    .orElseGet(() -> courseRepository.save(
                            new Course(null, "클라우드컴퓨팅", "1104", "IT관(E21-114)")
                    ));

            List<Course> courses = Arrays.asList(os, arch, cloud);

            // 3) 학생-과목 수강 관계(Takes) 생성 (중복 방지)
            List<Takes> existingTakes = takesRepository.findByStudent(student);
            Set<Long> existingCourseIds = existingTakes.stream()
                    .map(t -> t.getCourse().getId())
                    .collect(Collectors.toSet());

            for (Course course : courses) {
                if (!existingCourseIds.contains(course.getId())) {
                    takesRepository.save(new Takes(null, student, course));
                }
            }

            // 4) 각 과목마다 15주차 분량의 ClassSession 생성 (이미 있으면 추가하지 않음)
            // 기준 날짜: 2025년 9월 첫 주 월요일 (2025-09-01)
            LocalDate baseDate = LocalDate.of(2025, 9, 1); // 2025-09-01 (월요일)

            // 운영체제: 월요일 / 수요일 10:30-11:45 (주 2회, 15주차 → 총 30회)
            for (int week = 0; week < 15; week++) {
                // 월요일
                LocalDate monday = baseDate.plusWeeks(week);
                List<ClassSession> existingMon = classSessionRepository.findByCourseInAndSessionDate(
                        List.of(os), monday);
                if (existingMon.isEmpty()) {
                    ClassSession session = new ClassSession(
                            null,
                            os,
                            monday,
                            LocalTime.of(10, 30),
                            LocalTime.of(11, 45)
                    );
                    classSessionRepository.save(session);
                }

                // 수요일 (월요일 + 2일)
                LocalDate wednesday = baseDate.plusWeeks(week).plusDays(2);
                List<ClassSession> existingWed = classSessionRepository.findByCourseInAndSessionDate(
                        List.of(os), wednesday);
                if (existingWed.isEmpty()) {
                    ClassSession session = new ClassSession(
                            null,
                            os,
                            wednesday,
                            LocalTime.of(10, 30),
                            LocalTime.of(11, 45)
                    );
                    classSessionRepository.save(session);
                }
            }

            // 컴퓨터구조: 화요일 / 목요일 13:30-14:45 (주 2회, 15주차 → 총 30회)
            LocalDate tuesdayBase = baseDate.plusDays(1); // 2025-09-02 (화요일)
            for (int week = 0; week < 15; week++) {
                // 화요일
                LocalDate tuesday = tuesdayBase.plusWeeks(week);
                List<ClassSession> existingTue = classSessionRepository.findByCourseInAndSessionDate(
                        List.of(arch), tuesday);
                if (existingTue.isEmpty()) {
                    ClassSession session = new ClassSession(
                            null,
                            arch,
                            tuesday,
                            LocalTime.of(13, 30),
                            LocalTime.of(14, 45)
                    );
                    classSessionRepository.save(session);
                }

                // 목요일 (화요일 + 2일)
                LocalDate thursday = tuesdayBase.plusWeeks(week).plusDays(2);
                List<ClassSession> existingThu = classSessionRepository.findByCourseInAndSessionDate(
                        List.of(arch), thursday);
                if (existingThu.isEmpty()) {
                    ClassSession session = new ClassSession(
                            null,
                            arch,
                            thursday,
                            LocalTime.of(13, 30),
                            LocalTime.of(14, 45)
                    );
                    classSessionRepository.save(session);
                }
            }

            // 클라우드컴퓨팅: 금요일 10:00-11:45 (주 1회, 15주차 → 총 15회)
            // 첫 주 금요일 찾기 (2025-09-01이 월요일이므로 금요일은 2025-09-05)
            LocalDate fridayBaseDate = baseDate.plusDays(4); // 2025-09-05 (금요일)
            for (int week = 0; week < 15; week++) {
                LocalDate sessionDate = fridayBaseDate.plusWeeks(week);
                List<ClassSession> existing = classSessionRepository.findByCourseInAndSessionDate(
                        List.of(cloud), sessionDate);
                if (existing.isEmpty()) {
                    ClassSession session = new ClassSession(
                            null,
                            cloud,
                            sessionDate,
                            LocalTime.of(10, 0),
                            LocalTime.of(11, 45)
                    );
                    classSessionRepository.save(session);
                }
            }

            // 5) 각 과목의 모든 세션에 대해 출석 로그 생성 (이미 있으면 추가하지 않음)
            for (Course course : courses) {
                List<ClassSession> courseSessions = classSessionRepository
                        .findByCourseInAndSessionDateBetweenOrderBySessionDateAsc(
                                List.of(course), baseDate, baseDate.plusWeeks(20)); // 넉넉하게 범위 설정
                
                for (ClassSession session : courseSessions) {
                    // 해당 학생의 해당 세션에 대한 출석 로그가 이미 있는지 확인
                    List<AttendanceLog> existingLogs = attendanceLogRepository
                            .findByStudentAndClassSession(student, session);
                    
                    if (existingLogs.isEmpty()) {
                        // 모두 "출석" 처리 (일부는 지각/결석으로 바꿀 수도 있음)
                        AttendanceLog log = new AttendanceLog(
                                null,
                                student,
                                session,
                                AttendanceLog.AttendanceStatus.PRESENT,
                                LocalDateTime.of(session.getSessionDate(), session.getStartTime().plusMinutes(5)),
                                null,
                                null
                        );
                        attendanceLogRepository.save(log);
                    }
                }
            }

            System.out.println("[DataInitializer] 초기 과목, Takes, ClassSession, AttendanceLog 데이터가 준비되었습니다.");
        };
    }
}
