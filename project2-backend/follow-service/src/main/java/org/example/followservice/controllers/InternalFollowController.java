package org.example.followservice.controllers;

import org.example.followservice.services.FollowService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/internal/follows")
public class InternalFollowController {

    private final FollowService followService;

    public InternalFollowController(FollowService followService) {
        this.followService = followService;
    }

    @GetMapping("/{userId}/following")
    public List<Long> following(@PathVariable Long userId) {
        return followService.getFollowingIds(userId);
    }

    @GetMapping("/{userId}/followers")
    public List<Long> followers(@PathVariable Long userId) {
        return followService.getFollowerIds(userId);
    }
}
