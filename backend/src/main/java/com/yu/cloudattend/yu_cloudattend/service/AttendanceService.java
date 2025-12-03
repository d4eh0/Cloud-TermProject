package com.yu.cloudattend.yu_cloudattend.service;

import com.yu.cloudattend.yu_cloudattend.dto.CourseDto;
import com.yu.cloudattend.yu_cloudattend.entity.Student;
import com.yu.cloudattend.yu_cloudattend.entity.Takes;
import com.yu.cloudattend.yu_cloudattend.repository.StudentRepository;
import com.yu.cloudattend.yu_cloudattend.repository.TakesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final StudentRepository studentRepository;
    private final TakesRepository takesRepository;

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
}


