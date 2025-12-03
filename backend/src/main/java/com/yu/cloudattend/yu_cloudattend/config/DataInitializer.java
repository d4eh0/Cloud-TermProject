package com.yu.cloudattend.yu_cloudattend.config;

import com.yu.cloudattend.yu_cloudattend.entity.Student;
import com.yu.cloudattend.yu_cloudattend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    
    private final StudentRepository studentRepository;
    
    @Bean
    public ApplicationRunner initData() {
        return args -> {
            // 이미 데이터가 있으면 초기화하지 않음
            if (studentRepository.count() > 0) {
                return;
            }
            
            // 테스트용 학생 데이터 생성
            Student student = new Student();
            student.setStudentId("22213482");
            student.setPassword("1q2w3e4r!");
            student.setName("박대형");
            student.setDepartment("컴퓨터공학과");
            
            studentRepository.save(student);
        };
    }
}

