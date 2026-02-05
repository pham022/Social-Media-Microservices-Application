package org.revature.comreact.dto;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CommentResponse {

    private Long id;
    private String username;
    private Long postId;
    private String content;
    private Instant time;

    public CommentResponse(String username, Long postId, String content) {
        this.postId = postId;
        this.content = content;
    }
}
