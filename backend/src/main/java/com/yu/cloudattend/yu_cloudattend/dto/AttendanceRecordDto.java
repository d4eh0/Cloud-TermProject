package com.yu.cloudattend.yu_cloudattend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecordDto {

    // n주차 / n회차 등, 프론트에서 표시할 회차 정보 (예: "1주차")
    private String sessionLabel;

    // 수업 날짜 (예: "2025-12-02")
    private String date;

    // 출석 상태 (예: "출석", "지각", "결석")
    private String status;
}


