package com.yu.cloudattend.yu_cloudattend.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private boolean success;
    private UserDto user;
    private String message;

    // 토큰은 쿠키로만 전달하므로 JSON 응답에 포함하지 않음
    @JsonIgnore
    private String token;

    public static LoginResponse success(UserDto user, String token) {
        LoginResponse response = new LoginResponse();
        response.setSuccess(true);
        response.setUser(user);
        response.setToken(token);
        return response;
    }

    public static LoginResponse failure(String message) {
        LoginResponse response = new LoginResponse();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }
}
