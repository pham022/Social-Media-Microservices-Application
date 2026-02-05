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
    private Long userId;
    private Long postId;
    private String content;
    private Instant time;
}
