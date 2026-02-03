package org.example.followservice.controllers;

import org.example.followservice.services.FollowService;
import org.example.followservice.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/follows")
@CrossOrigin
public class FollowController {

    private final FollowService followService;
    private final JwtUtil jwtUtil;

    public FollowController(FollowService followService, JwtUtil jwtUtil) {
        this.followService = followService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Void> follow(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long userId
    ) {
        Long me = jwtUtil.extractUserId(auth);
        followService.follow(me, userId);
        return ResponseEntity.status(201).build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unfollow(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long userId
    ) {
        Long me = jwtUtil.extractUserId(auth);
        followService.unfollow(me, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/following")
    public List<Long> myFollowing(@RequestHeader("Authorization") String auth) {
        Long me = jwtUtil.extractUserId(auth);
        return followService.getFollowingIds(me);
    }

    @GetMapping("/{userId}/followers")
    public List<Long> followers(@PathVariable Long userId) {
        return followService.getFollowerIds(userId);
    }

    @GetMapping("/{userId}/following")
    public List<Long> following(@PathVariable Long userId) {
        return followService.getFollowingIds(userId);
    }

    @GetMapping("/me/is-following/{userId}")
    public Map<String, Boolean> isFollowing(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long userId
    ) {
        Long me = jwtUtil.extractUserId(auth);
        return Map.of("isFollowing", followService.isFollowing(me, userId));
    }

    @GetMapping("/{userId}/counts")
    public FollowService.Counts counts(@PathVariable Long userId) {
        return followService.getCounts(userId);
    }
}
