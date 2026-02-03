package com.revature.controller;

import com.revature.dto.AuthResponse;
import com.revature.dto.LoginRequest;
import com.revature.dto.RegisterRequest;
import com.revature.dto.CurrentUserValidationResponse;
import com.revature.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);

        //profileService api to create

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }

    @GetMapping("/user-info")
    public ResponseEntity<CurrentUserValidationResponse> getUserInfo(@RequestParam String token) {
        CurrentUserValidationResponse userInfo = authService.getUserInfoFromToken(token);
        return ResponseEntity.ok(userInfo);
    }
}
