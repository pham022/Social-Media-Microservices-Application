package org.revature.comreact.services;

import org.revature.comreact.dto.CommentResponse;
import org.revature.comreact.dto.ProfileResponse;
import org.revature.comreact.entities.Comment;
import org.revature.comreact.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public CommentResponse insert(CommentResponse commentResponse) {
        Comment comment = new Comment(commentResponse.getUsername(), commentResponse.getPostId(), commentResponse.getContent());
        comment = commentRepository.save(comment);
        commentResponse = new CommentResponse(comment.getId(), comment.getUsername(), comment.getPostId(), comment.getContent(), comment.getTime());
        return commentResponse;
    }

    public CommentResponse getById(Long id) {
        Comment comment = commentRepository.getById(id);
        return new CommentResponse(comment.getId(), comment.getUsername(), comment.getPostId(), comment.getContent(), comment.getTime());
    }

    public List<CommentResponse> getAll() {
        List<Comment> comments = commentRepository.findAll();
        List<CommentResponse> commentResponses = new ArrayList<>();
        for(Comment comment : comments) {
            commentResponses.add(new CommentResponse(comment.getId(), comment.getUsername(), comment.getPostId(), comment.getContent(), comment.getTime()));
        }
        return commentResponses;
    }

    public List<CommentResponse> getByPostId(Long id) {
        List<Comment> comments = commentRepository.getByPostId(id);
        List<CommentResponse> commentResponses = new ArrayList<>();
        for(Comment comment : comments) {
            commentResponses.add(new CommentResponse(comment.getId(), comment.getUsername(), comment.getPostId(), comment.getContent(), comment.getTime()));
        }
        return commentResponses;
    }

    public void deleteById(Long id) { commentRepository.deleteById(id); }

//    public Comment update(Comment comment) { return commentRepository.update(comment); }


}
