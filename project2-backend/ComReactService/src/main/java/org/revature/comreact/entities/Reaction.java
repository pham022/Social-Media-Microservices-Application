package org.revature.comreact.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.revature.comreact.enums.ReactionType;

@NoArgsConstructor
@Data
@Entity
public class Reaction {

    @Id
    @GeneratedValue
    private long id;

//    @ManyToOne
//    @JoinColumn(name = "user_id_fk")
    private String username;

//    @ManyToOne
//    @JoinColumn(name = "post_id_fk")
    private long postId;

    @Enumerated(EnumType.STRING)
    private ReactionType reaction;

    public Reaction(String username, long postId, ReactionType reaction) {
        this.username = username;
        this.postId = postId;
        this.reaction = reaction;
    }
}
