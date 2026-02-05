package com.revature.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String token;
    private String username;
    private String email;
    private String message;
    private String password;
    private String firstName;
    private String lastName;
    private ProfileResponse profile;
}