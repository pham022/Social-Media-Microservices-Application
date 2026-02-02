package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrentUserValidationResponse {
    private boolean valid;
    private Long userId;
    private String email;
    private String username;
}