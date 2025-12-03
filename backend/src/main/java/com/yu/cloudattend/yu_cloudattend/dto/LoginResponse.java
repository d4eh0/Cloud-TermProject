package com.yu.cloudattend.yu_cloudattend.dto;

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
    
    public static LoginResponse success(UserDto user) {
        LoginResponse response = new LoginResponse();
        response.setSuccess(true);
        response.setUser(user);
        return response;
    }
    
    public static LoginResponse failure(String message) {
        LoginResponse response = new LoginResponse();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }
}

