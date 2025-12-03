package com.yu.cloudattend.yu_cloudattend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceCheckResponse {
    private Long id;                    // 출석 로그 ID (AttendanceLog.id)
    private Long lectureId;              // 수업 세션 ID
    private String status;              // 출석 상태 ("출석", "지각", "결석")
    private String attendanceTime;       // 출석 시간 (HH:mm 형식)
    private LocationInfo location;       // 위치 정보

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationInfo {
        private Double latitude;
        private Double longitude;
    }
}

