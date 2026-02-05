package com.revature.service;

//import com.revature.dto.AuthResponse;
//import com.revature.dto.LoginRequest;
//import com.revature.dto.RegisterRequest;
import com.revature.dto.*;
import com.revature.model.User;
import com.revature.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    private ProfileRestClientService profileClient;
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

        user = userRepository.save(user);

        ProfileCreationRequest profileRequest = new ProfileCreationRequest();
        profileRequest.setUsername(request.getUsername());
        profileRequest.setPassword(request.getPassword());
        profileRequest.setFirstName("");
        profileRequest.setLastName("");
        profileRequest.setBio("");

        ProfileResponse profile = profileClient.createProfile(profileRequest);

        AuthResponse response = new AuthResponse();
        response.setUserId(user.getId());
        response.setToken(token);
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setMessage("Registration successful");
        response.setProfile(profile);

        return response;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileResponse profile = profileClient.getProfileByUsername(user.getUsername());

        AuthResponse response = new AuthResponse();
        response.setUserId(user.getId());
        response.setToken(user.getToken());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setMessage("Login successful");
        response.setProfile(profile);

        return response;
    }

    public boolean validateToken(String token) {
        return jwtService.validateToken(token);
    }

}
