package org.revature.comreact.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.revature.comreact.enums.ReactionType;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ReactionResponse {

    private long id;
    private long userId;
    private long postId;
    @Enumerated(EnumType.STRING)
    private ReactionType reaction;

    public ReactionResponse(long userId, long postId, ReactionType reaction) {
        this.userId = userId;
        this.postId = postId;
        this.reaction = reaction;
    }
}
