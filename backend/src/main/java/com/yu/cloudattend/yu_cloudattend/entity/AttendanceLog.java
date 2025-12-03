package com.yu.cloudattend.yu_cloudattend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 학생의 출석인지
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // 어떤 수업 세션(ClassSession)에 대한 출석인지
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_session_id", nullable = false)
    private ClassSession classSession;

    // 출석 상태 (예: PRESENT, LATE, ABSENT)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AttendanceStatus status;

    // 실제 출석 체크 시간
    @Column(nullable = false)
    private LocalDateTime attendanceTime;

    // 위치 정보 (향후 출석 체크 API에서 활용 예정)
    private Double latitude;
    private Double longitude;

    public enum AttendanceStatus {
        PRESENT,
        LATE,
        ABSENT
    }
}


