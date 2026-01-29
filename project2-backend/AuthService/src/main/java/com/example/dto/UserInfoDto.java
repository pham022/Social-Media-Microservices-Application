package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {
    private Long userId;
    private String username;
    private String email;
    private String role;
    private boolean isActive;
}