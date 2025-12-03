package com.yu.cloudattend.yu_cloudattend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "class_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClassSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 과목의 수업인지
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    // 수업 날짜 (예: 2025-12-02)
    @Column(nullable = false)
    private LocalDate sessionDate;

    // 시작 시간 (예: 11:00)
    @Column(nullable = false)
    private LocalTime startTime;

    // 종료 시간 (예: 12:15)
    @Column(nullable = false)
    private LocalTime endTime;

    // 강의실 (기본은 Course.location 복사, 필요시 변경 가능)
    @Column(nullable = false, length = 100)
    private String location;
}


