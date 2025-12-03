package com.yu.cloudattend.yu_cloudattend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceCheckRequest {
    private Long lectureId;        // 수업 세션 ID (ClassSession.id)
    private Double latitude;       // 위도
    private Double longitude;      // 경도
    private String deviceId;       // 기기 ID
    private String captchaToken;  // CAPTCHA 토큰 (향후 검증용)
}

