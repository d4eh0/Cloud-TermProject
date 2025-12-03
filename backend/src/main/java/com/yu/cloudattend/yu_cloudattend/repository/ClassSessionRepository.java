package com.yu.cloudattend.yu_cloudattend.repository;

import com.yu.cloudattend.yu_cloudattend.entity.ClassSession;
import com.yu.cloudattend.yu_cloudattend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ClassSessionRepository extends JpaRepository<ClassSession, Long> {

    // 특정 과목들에 대해, 특정 날짜의 세션 목록 조회
    List<ClassSession> findByCourseInAndSessionDate(List<Course> courses, LocalDate sessionDate);

    // 특정 과목들에 대해, 날짜 범위 내의 세션 목록 조회 (날짜 오름차순)
    List<ClassSession> findByCourseInAndSessionDateBetweenOrderBySessionDateAsc(
            List<Course> courses, LocalDate startDate, LocalDate endDate);
}


