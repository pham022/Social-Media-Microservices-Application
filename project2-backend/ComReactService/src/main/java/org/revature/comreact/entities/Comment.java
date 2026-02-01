package org.revature.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@NoArgsConstructor
@Data
@Entity
public class Comment {

    @Id
    @GeneratedValue
    private Long id;

//    @ManyToOne
//    @JoinColumn(name = "user_id_fk")
    private Long userId;

//    @ManyToOne
//    @JoinColumn(name = "post_id_fk")
    private Long postId;

    private String content;

    private Instant time;

    public Comment(Long userId, Long postId, String content) {
        this.userId = userId;
        this.postId = postId;
        this.content = content;
        this.time = Instant.now();
    }
}
