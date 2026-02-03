package org.revature.comreact.services;

import org.revature.comreact.entities.Reaction;
import org.revature.comreact.enums.ReactionType;
import org.revature.comreact.repositories.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    @Transactional
    public Reaction create(Reaction reaction) {
        Reaction old = reactionRepository.getByUserIdAndPostId(reaction.getUserId(), reaction.getPostId());
        if(old == null) {
            return reactionRepository.save(reaction);
        } else if(old.getReaction().equals(reaction.getReaction())) {
            return null;
        } else {
            old.setReaction(reaction.getReaction());
            return reactionRepository.save(old);
        }
    }

    public Reaction getById(Long id) {
        return reactionRepository.getById(id);
    }

    public List<Reaction> getAll() {
        return reactionRepository.findAll();
    }

    public List<Reaction> getByPostId(Long id) {
        return reactionRepository.getByPostId(id);
    }

//    public Reaction getByUserId(Long id) { return reactionRepository.getByUserId(id); }

    public void deleteById(Long id) { reactionRepository.deleteById(id); }

//    public Reaction update(Reaction reaction) { return reactionRepository.update(reaction); }
}
