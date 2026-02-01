package org.revature.services;

import org.revature.comreact.entities.Reaction;
import org.revature.comreact.repositories.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    public Reaction insert(Reaction reaction) {
        return reactionRepository.save(reaction);
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
}
