package com.yu.cloudattend.yu_cloudattend.repository;

import com.yu.cloudattend.yu_cloudattend.entity.AttendanceLog;
import com.yu.cloudattend.yu_cloudattend.entity.ClassSession;
import com.yu.cloudattend.yu_cloudattend.entity.Course;
import com.yu.cloudattend.yu_cloudattend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLog, Long> {

    // 특정 학생 + 특정 과목에 대한 모든 출석 로그 (ClassSession 날짜 기준 정렬)
    List<AttendanceLog> findByStudentAndClassSession_CourseOrderByClassSession_SessionDateAsc(
            Student student,
            Course course
    );

    // 특정 학생 + 특정 세션에 대한 출석 로그 조회
    List<AttendanceLog> findByStudentAndClassSession(Student student, ClassSession classSession);
}


