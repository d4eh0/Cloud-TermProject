package com.yu.cloudattend.yu_cloudattend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSessionDto {

    private Long id;              // ClassSession ID
    private String courseName;    // 과목명
    private String date;          // 예: 2025-12-02
    private String time;          // 예: 11:00 ~ 12:15
    private String location;      // 강의실
    private Integer remainingTime; // 남은 출석 가능 시간 (분) - 1차 버전에서는 고정 값
}


