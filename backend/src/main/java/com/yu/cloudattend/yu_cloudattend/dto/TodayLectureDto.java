package com.yu.cloudattend.yu_cloudattend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TodayLectureDto {
    private Long id;                 // ClassSession ID
    private String courseName;
    private String date;             // 표시용 날짜 문자열 (예: 2025-12-02)
    private String time;             // "HH:mm ~ HH:mm"
    private String location;
    private String attendanceStatus; // 일단 "미확인"
    private String attendanceTime;   // 일단 null
}


