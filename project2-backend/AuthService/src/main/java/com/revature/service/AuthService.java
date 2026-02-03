package com.revature.service;

import com.revature.dto.AuthResponse;
import com.revature.dto.LoginRequest;
import com.revature.dto.RegisterRequest;
import com.revature.dto.CurrentUserValidationResponse;
import com.revature.model.User;
import com.revature.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;

//    public AuthService(UserRepository userRepository, JwtService jwtService, UserRepository userRepository1, JwtService jwtService1) {
//        this.userRepository = userRepository1;
//        this.jwtService = jwtService1;
//    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(
                savedUser.getEmail(),
                savedUser.getId()
        );
        user.setToken(token);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getToken(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                "Registration successful"
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(
                user.getId(),
                user.getToken(),
                user.getUsername(),
                user.getEmail(),
                "Login successfully"
        );
    }

    public boolean validateToken(String token) {
        return jwtService.validateToken(token);
    }

    public CurrentUserValidationResponse getUserInfoFromToken(String token) {
        if (!jwtService.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }

        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new CurrentUserValidationResponse(
                true,
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }

}
