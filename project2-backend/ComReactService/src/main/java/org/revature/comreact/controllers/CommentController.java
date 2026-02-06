package org.revature.comreact.controllers;

import org.revature.comreact.entities.Comment;
import org.revature.comreact.exceptions.CommentNotFoundException;
import org.revature.comreact.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/comments")
@RestController
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping()
    public ResponseEntity<Comment> insert(@RequestBody Comment comment) {
        try {
            // Validate required fields
            if (comment.getUserId() == null || comment.getPostId() == null || 
                comment.getContent() == null || comment.getContent().trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            comment = this.commentService.insert(comment);
            System.out.println("Comment created: " + comment);
            if (comment != null && comment.getId() != null) {
                return new ResponseEntity<>(comment, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            System.err.println("Error creating comment: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getById(@PathVariable("id") Long id) throws CommentNotFoundException {
        Comment comment = this.commentService.getById(id);
        if (comment == null) throw new CommentNotFoundException(id);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Comment>> getAll() {
        return new ResponseEntity<>(this.commentService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<List<Comment>> getByPostId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(this.commentService.getByPostId(id), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public void deleteById(@PathVariable("id") Long id) throws CommentNotFoundException {
        if (this.commentService.getById(id) == null) throw new CommentNotFoundException(id);
        this.commentService.deleteById(id);
    }
}
