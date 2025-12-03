package com.yu.cloudattend.yu_cloudattend.repository;

import com.yu.cloudattend.yu_cloudattend.entity.Student;
import com.yu.cloudattend.yu_cloudattend.entity.Takes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TakesRepository extends JpaRepository<Takes, Long> {

    // 특정 학생이 수강 중인 모든 Takes
    List<Takes> findByStudent(Student student);
}

