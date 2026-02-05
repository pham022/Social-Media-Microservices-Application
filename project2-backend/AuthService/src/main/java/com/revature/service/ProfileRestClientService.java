package com.revature.service;

import com.revature.dto.ProfileCreationRequest;
import com.revature.dto.ProfileResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class ProfileRestClientService {

    @Autowired
    private RestTemplate restTemplate;


    private static final String PROFILE_BASE_URL = "http://localhost:8082";

    public ProfileResponse createProfile(ProfileCreationRequest request) {
        try {
            String url = PROFILE_BASE_URL + "/profiles";
            return restTemplate.postForObject(url, request, ProfileResponse.class);
        } catch (RestClientException e) {
            System.err.println("Error creating profile: " + e.getMessage());
            return null;
        }
    }

    public ProfileResponse getProfileByUsername(String username) {
        try {
            String url = PROFILE_BASE_URL + "/profiles/username/" + username;
            return restTemplate.getForObject(url, ProfileResponse.class);
        } catch (RestClientException e) {
            System.err.println("Error fetching profile: " + e.getMessage());
            return null;
        }
    }
}
