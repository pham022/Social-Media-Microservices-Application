package org.revature.comreact.services;

import org.revature.comreact.dto.ReactionResponse;
import org.revature.comreact.entities.Reaction;
import org.revature.comreact.repositories.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    @Transactional
    public ReactionResponse create(ReactionResponse reactionResponse) {
        Reaction old = reactionRepository.getByUserIdAndPostId(reactionResponse.getUserId(), reactionResponse.getPostId());
        Reaction reaction;
        if(old == null) {
            reaction = new Reaction(reactionResponse.getUserId(), reactionResponse.getPostId(), reactionResponse.getReaction());
            reaction = reactionRepository.save(reaction);
            return new ReactionResponse(reaction.getId(), reaction.getUserId(), reaction.getPostId(), reaction.getReaction());
        } else if(old.getReaction().equals(reactionResponse.getReaction())) {
            return null;
        } else {
            old.setReaction(reactionResponse.getReaction());
            reaction = reactionRepository.save(old);
            return new ReactionResponse(reaction.getId(), reaction.getUserId(), reaction.getPostId(), reaction.getReaction());
        }
    }

    public ReactionResponse getById(Long id) {
        Reaction reaction = reactionRepository.getById(id);
        return new ReactionResponse(reaction.getId(), reaction.getUserId(), reaction.getPostId(), reaction.getReaction());
    }

    public List<ReactionResponse> getAll() {
        List<Reaction> reactions = reactionRepository.findAll();
        List<ReactionResponse> reactionResponses = new ArrayList<>();
        for(Reaction reaction : reactions) {
            reactionResponses.add(new ReactionResponse(reaction.getId(), reaction.getUserId(), reaction.getPostId(), reaction.getReaction()));
        }
        return reactionResponses;
    }

    public List<ReactionResponse> getByPostId(Long id) {
        List<Reaction> reactions = reactionRepository.getByPostId(id);
        List<ReactionResponse> reactionResponses = new ArrayList<>();
        for(Reaction reaction : reactions) {
            reactionResponses.add(new ReactionResponse(reaction.getId(), reaction.getUserId(), reaction.getPostId(), reaction.getReaction()));
        }
        return reactionResponses;
    }

    public void deleteById(Long id) { reactionRepository.deleteById(id); }


}
