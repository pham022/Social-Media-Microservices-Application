package com.example.project2_backend.services;

import com.example.project2_backend.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import src.main.java.com.example.project2_backend.entities.Comment;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment insert(Comment comment) {
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
}
