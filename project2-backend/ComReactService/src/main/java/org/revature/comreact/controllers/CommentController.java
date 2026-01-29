package com.example.project2_backend.controllers;

import com.example.project2_backend.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import src.main.java.com.example.project2_backend.entities.Comment;

import java.util.List;

@RequestMapping("/comments")
@RestController
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping()
    public ResponseEntity<Comment> insert(@RequestBody Comment comment) {
        comment = this.commentService.insert(comment);
        if(comment != null) return new ResponseEntity<>(comment, HttpStatus.CREATED);
        else return new ResponseEntity<>(new Comment(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(this.commentService.getById(id), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Comment>> getAll() {
        return new ResponseEntity<>(this.commentService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<List<Comment>> getByPostId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(this.commentService.getByPostId(id), HttpStatus.OK);
    }

}
