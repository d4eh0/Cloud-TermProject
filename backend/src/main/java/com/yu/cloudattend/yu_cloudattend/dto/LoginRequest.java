package com.yu.cloudattend.yu_cloudattend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    @NotBlank(message = "학번을 입력해주세요.")
    private String studentId;
    
    @NotBlank(message = "비밀번호를 입력해주세요.")
    private String password;
}

