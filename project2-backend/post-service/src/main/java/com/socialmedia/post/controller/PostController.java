package com.socialmedia.post.controller;

import com.socialmedia.post.dto.PostDto;
import com.socialmedia.post.dto.PostCreateRequest;
import com.socialmedia.post.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    
    private final PostService postService;
    
    public PostController(PostService postService) {
        this.postService = postService;
    }
    
    @PostMapping
    public ResponseEntity<PostDto> createPost(
            @Valid @RequestBody PostCreateRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        PostDto post = postService.createPost(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }
    
    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long postId) {
        PostDto post = postService.getPostById(postId);
        return ResponseEntity.ok(post);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDto>> getUserPosts(@PathVariable Long userId) {
        List<PostDto> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/feed")
    public ResponseEntity<List<PostDto>> getFeed(@RequestParam List<Long> userIds) {
        List<PostDto> posts = postService.getFeed(userIds);
        return ResponseEntity.ok(posts);
    }
    
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId, @RequestHeader("X-User-Id") Long userId) {
        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }
}
