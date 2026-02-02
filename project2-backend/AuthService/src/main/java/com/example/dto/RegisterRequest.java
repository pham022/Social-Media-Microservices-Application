package com.example.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class RegisterRequest {

    @NonNull
    private String username;

    @NonNull
    private String email;

    @NonNull
    private String password;
}
