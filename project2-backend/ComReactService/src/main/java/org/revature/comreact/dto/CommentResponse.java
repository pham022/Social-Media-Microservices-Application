package org.revature.comreact.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@NoArgsConstructor
@Data
public class CommentResponse {

    private Long id;
    private Long userId;
    private Long postId;
    private String content;
    private Instant time;

    public CommentResponse(Long userId, Long postId, String content) {
        this.userId = userId;
        this.postId = postId;
        this.content = content;
        this.time = Instant.now();
    }
}
