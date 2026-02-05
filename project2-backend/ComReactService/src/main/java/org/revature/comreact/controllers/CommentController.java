package org.revature.comreact.controllers;

import org.revature.comreact.dto.CommentResponse;
import org.revature.comreact.entities.Comment;
import org.revature.comreact.exceptions.CommentNotFoundException;
import org.revature.comreact.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping()
    public ResponseEntity<CommentResponse> insert(@RequestBody CommentResponse comment) {
        comment = this.commentService.insert(comment);
        System.out.println(comment);
        if (comment != null) return new ResponseEntity<>(comment, HttpStatus.CREATED);
        else return new ResponseEntity<>(new CommentResponse(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponse> getById(@PathVariable("id") Long id) throws CommentNotFoundException {
        CommentResponse comment = this.commentService.getById(id);
        if (comment == null) throw new CommentNotFoundException(id);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<CommentResponse>> getAll() {
        return new ResponseEntity<>(this.commentService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<List<CommentResponse>> getByPostId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(this.commentService.getByPostId(id), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public void deleteById(@PathVariable("id") Long id) throws CommentNotFoundException {
        if (this.commentService.getById(id) == null) throw new CommentNotFoundException(id);
        this.commentService.deleteById(id);
    }
}
