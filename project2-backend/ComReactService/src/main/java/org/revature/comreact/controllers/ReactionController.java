package org.revature.comreact.controllers;

import org.revature.comreact.entities.Reaction;
import org.revature.comreact.exceptions.ReactionNotFoundException;
import org.revature.comreact.services.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/reactions")
public class ReactionController {

    @Autowired
    private ReactionService reactionService;

    @PostMapping
    public ResponseEntity<Reaction> insert(@RequestBody Reaction reaction) {
        reaction = this.reactionService.create(reaction);
        if (reaction != null) return new ResponseEntity<>(reaction, HttpStatus.CREATED);
        else return new ResponseEntity<>(new Reaction(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reaction> getById(@PathVariable("id") Long id) throws ReactionNotFoundException {
        Reaction reaction = this.reactionService.getById(id);
        if(reaction == null) throw new ReactionNotFoundException(id);
        return new ResponseEntity<>(reaction, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<Reaction>> getAll() {
        return new ResponseEntity<>(this.reactionService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<List<Reaction>> getByPostId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(this.reactionService.getByPostId(id), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public void deleteById(@PathVariable("id") Long id) throws ReactionNotFoundException {
        if(this.reactionService.getById(id) == null) throw new ReactionNotFoundException(id);
        this.reactionService.deleteById(id);
    }
}
