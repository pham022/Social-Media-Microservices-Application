package com.socialmedia.post.repository;

import com.socialmedia.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT p FROM Post p WHERE p.userId IN :userIds ORDER BY p.createdAt DESC")
    List<Post> findByUserIdInOrderByCreatedAtDesc(@Param("userIds") List<Long> userIds);
}
