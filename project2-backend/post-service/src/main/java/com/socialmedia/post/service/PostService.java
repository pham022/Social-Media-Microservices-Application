package com.socialmedia.post.service;

import com.socialmedia.post.dto.PostDto;
import com.socialmedia.post.dto.PostCreateRequest;
import com.socialmedia.post.entity.Post;
import com.socialmedia.post.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {
    
    private final PostRepository postRepository;
    
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }
    
    public PostDto createPost(PostCreateRequest request, Long userId) {
        Post post = new Post();
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setUserId(userId);
        
        Post saved = postRepository.save(post);
        return convertToDto(saved);
    }
    
    public PostDto getPostById(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found: " + postId));
        return convertToDto(post);
    }
    
    public List<PostDto> getPostsByUserId(Long userId) {
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return posts.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    public List<PostDto> getFeed(List<Long> userIds) {
        List<Post> posts = postRepository.findByUserIdInOrderByCreatedAtDesc(userIds);
        return posts.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found: " + postId));
        
        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Cannot delete another user's post");
        }
        
        postRepository.delete(post);
    }
    
    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setUserId(post.getUserId());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }
}
