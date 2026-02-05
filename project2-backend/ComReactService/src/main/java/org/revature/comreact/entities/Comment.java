package org.revature.comreact.entities;

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
    private String username;

//    @ManyToOne
//    @JoinColumn(name = "post_id_fk")
    private Long postId;

    private String content;

    private Instant time;

    public Comment(String username, Long postId, String content) {
        this.username = username;
        this.postId = postId;
        this.content = content;
        this.time = Instant.now();
    }
}
