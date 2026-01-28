package com.example.project2_backend.controllers;

import com.example.project2_backend.entities.Reaction;
import com.example.project2_backend.services.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/reactions")
@RestController
public class ReactionController {

    @Autowired
    private ReactionService reactionService;

    @PostMapping
    public ResponseEntity<Reaction> insert(@RequestBody Reaction reaction) {
        reaction = this.reactionService.insert(reaction);
        if(reaction != null) return new ResponseEntity<>(reaction, HttpStatus.CREATED);
        else return new ResponseEntity<>(new Reaction(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reaction> getById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(this.reactionService.getById(id), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Reaction>> getAll() {
        return new ResponseEntity<>(this.reactionService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<List<Reaction>> getByPostId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(this.reactionService.getByPostId(id), HttpStatus.OK);
    }
}
