package com.yu.cloudattend.yu_cloudattend.config;

import com.yu.cloudattend.yu_cloudattend.entity.ClassSession;
import com.yu.cloudattend.yu_cloudattend.entity.Course;
import com.yu.cloudattend.yu_cloudattend.entity.Student;
import com.yu.cloudattend.yu_cloudattend.entity.Takes;
import com.yu.cloudattend.yu_cloudattend.repository.ClassSessionRepository;
import com.yu.cloudattend.yu_cloudattend.repository.CourseRepository;
import com.yu.cloudattend.yu_cloudattend.repository.StudentRepository;
import com.yu.cloudattend.yu_cloudattend.repository.TakesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.DayOfWeek;
import java.time.LocalDate;
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

            // 4) 오늘 날짜 기준 ClassSession 생성 (이미 있으면 추가하지 않음)
            LocalDate today = LocalDate.now();
            List<ClassSession> existingSessions =
                    classSessionRepository.findByCourseInAndSessionDate(courses, today);

            if (existingSessions.isEmpty()) {
                // 오늘 요일에 따라 해당 요일의 수업 세션만 생성
                DayOfWeek dayOfWeek = today.getDayOfWeek();

                switch (dayOfWeek) {
                    case MONDAY -> {
                        // 운영체제: 월 10:30 - 11:45
                        classSessionRepository.save(new ClassSession(
                                null,
                                os,
                                today,
                                LocalTime.of(10, 30),
                                LocalTime.of(11, 45)
                        ));
                        // 컴퓨터구조: 월 13:30 - 14:45
                        classSessionRepository.save(new ClassSession(
                                null,
                                arch,
                                today,
                                LocalTime.of(13, 30),
                                LocalTime.of(14, 45)
                        ));
                    }
                    case WEDNESDAY -> {
                        // 운영체제: 수 09:00 - 10:15
                        classSessionRepository.save(new ClassSession(
                                null,
                                os,
                                today,
                                LocalTime.of(9, 0),
                                LocalTime.of(10, 15)
                        ));
                    }
                    case THURSDAY -> {
                        // 컴퓨터구조: 목 12:00 - 13:15
                        classSessionRepository.save(new ClassSession(
                                null,
                                arch,
                                today,
                                LocalTime.of(12, 0),
                                LocalTime.of(13, 15)
                        ));
                    }
                    case FRIDAY -> {
                        // 클라우드컴퓨팅: 금 10:00 - 11:45
                        classSessionRepository.save(new ClassSession(
                                null,
                                cloud,
                                today,
                                LocalTime.of(10, 0),
                                LocalTime.of(11, 45)
                        ));
                    }
                    default -> {
                        // 화/토/일 등에는 오늘 수업 없음
                        System.out.println("[DataInitializer] 오늘은 등록된 수업이 없는 요일입니다: " + dayOfWeek);
                    }
                }
            }

            System.out.println("[DataInitializer] 초기 과목, Takes, ClassSession 데이터가 준비되었습니다.");
        };
    }
}
