package org.revature.comreact.services;

import org.revature.comreact.entities.Comment;
import org.revature.comreact.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment insert(Comment comment) {
        // Set time if not already set (when deserializing from JSON)
        if (comment.getTime() == null) {
            comment.setTime(Instant.now());
        }
        return commentRepository.save(comment);
    }

    public Comment getById(Long id) {
        return commentRepository.getById(id);
    }

    public List<Comment> getAll() {
        return commentRepository.findAll();
    }

    public List<Comment> getByPostId(Long id) {
        return commentRepository.getByPostId(id);
    }

    public void deleteById(Long id) { commentRepository.deleteById(id); }

//    public Comment update(Comment comment) { return commentRepository.update(comment); }


}
