package org.revature.comreact.services;

import org.modelmapper.ModelMapper;
import org.revature.comreact.dto.CommentResponse;
import org.revature.comreact.entities.Comment;
import org.revature.comreact.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ModelMapper mapper;

    public CommentResponse insert(CommentResponse commentResponse) {
        Comment comment = mapper.map(commentResponse, Comment.class);
        comment = commentRepository.save(comment);
        commentResponse = mapper.map(comment, CommentResponse.class);
        return commentResponse;
    }

    public CommentResponse getById(Long id) {
        Comment comment = commentRepository.getById(id);
        return mapper.map(comment, CommentResponse.class);
    }

    public List<CommentResponse> getAll() {
        List<Comment> comments = commentRepository.findAll();
        List<CommentResponse> commentResponses = new ArrayList<>();
        for(Comment comment : comments) {
            commentResponses.add(mapper.map(comment, CommentResponse.class));
        }
        return commentResponses;
    }

    public List<CommentResponse> getByPostId(Long id) {
        List<Comment> comments = commentRepository.getByPostId(id);
        List<CommentResponse> commentResponses = new ArrayList<>();
        for(Comment comment : comments) {
            commentResponses.add(mapper.map(comment, CommentResponse.class));
        }
        return commentResponses;
    }

    public void deleteById(Long id) { commentRepository.deleteById(id); }

//    public Comment update(Comment comment) { return commentRepository.update(comment); }


}
