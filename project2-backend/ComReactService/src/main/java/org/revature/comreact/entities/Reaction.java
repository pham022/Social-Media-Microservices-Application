package com.example.project2_backend.entities;

import com.example.project2_backend.enums.ReactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Reaction {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id_fk")
    private long userId;

    @ManyToOne
    @JoinColumn(name = "post_id_fk")
    private long postId;

    @Enumerated(EnumType.STRING)
    private ReactionType reaction;
}
