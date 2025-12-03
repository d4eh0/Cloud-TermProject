package com.yu.cloudattend.yu_cloudattend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDetailDto {

    private Long courseId;
    private String courseName;
    private String courseCode;

    // 주차별 / 회차별 출석 기록 리스트
    private List<AttendanceRecordDto> records;
}


