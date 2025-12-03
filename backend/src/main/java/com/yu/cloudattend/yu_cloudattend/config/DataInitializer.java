package com.yu.cloudattend.yu_cloudattend.config;

import com.yu.cloudattend.yu_cloudattend.entity.Course;
import com.yu.cloudattend.yu_cloudattend.entity.Student;
import com.yu.cloudattend.yu_cloudattend.entity.Takes;
import com.yu.cloudattend.yu_cloudattend.repository.CourseRepository;
import com.yu.cloudattend.yu_cloudattend.repository.StudentRepository;
import com.yu.cloudattend.yu_cloudattend.repository.TakesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final TakesRepository takesRepository;

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

            // 2) 필요한 과목(운영체제, 컴퓨터구조, 클라우드컴퓨팅) 조회
            Course os = courseRepository.findByCourseCode("1102")
                    .orElse(null);
            Course arch = courseRepository.findByCourseCode("1103")
                    .orElse(null);
            Course cloud = courseRepository.findByCourseCode("1104")
                    .orElse(null);

            if (os == null || arch == null || cloud == null) {
                System.out.println("[DataInitializer] 필요한 과목(1102, 1103, 1104) 중 하나 이상이 존재하지 않아 Takes 데이터를 추가하지 않습니다.");
                return;
            }

            // 3) 학생-과목 수강 관계(Takes) 생성 (클라우드컴퓨팅, 운영체제, 컴퓨터구조 3개만)
            takesRepository.save(new Takes(null, student, os));
            takesRepository.save(new Takes(null, student, arch));
            takesRepository.save(new Takes(null, student, cloud));

            System.out.println("[DataInitializer] studentId=22211111 학생의 Takes 데이터가 추가되었습니다.");
        };
    }
}