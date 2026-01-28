package src.main.java.com.example.project2_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Comment {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id_fk")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "post_id_fk")
    private Long postId;

    private String content;

    private Timestamp time;
}
