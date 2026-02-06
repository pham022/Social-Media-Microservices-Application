package org.revature.comreact.controllers;

import org.revature.comreact.dto.ReactionResponse;
import org.revature.comreact.exceptions.ReactionNotFoundException;
import org.revature.comreact.services.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/reactions")
@RestController
@CrossOrigin("*")
public class ReactionController {

    @Autowired
    private ReactionService reactionService;

    @PostMapping
    public ResponseEntity<ReactionResponse> insert(@RequestBody ReactionResponse reaction) {
        reaction = this.reactionService.create(reaction);
        if (reaction != null) return new ResponseEntity<>(reaction, HttpStatus.CREATED);
        else return new ResponseEntity<>(new ReactionResponse(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReactionResponse> getById(@PathVariable("id") Long id) throws ReactionNotFoundException {
        ReactionResponse reaction = this.reactionService.getById(id);
        if(reaction == null) throw new ReactionNotFoundException(id);
        return new ResponseEntity<>(reaction, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<ReactionResponse>> getAll() {
        return new ResponseEntity<>(this.reactionService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<List<ReactionResponse>> getByPostId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(this.reactionService.getByPostId(id), HttpStatus.OK);
    }

    @DeleteMapping("{id}")
    public void deleteById(@PathVariable("id") Long id) throws ReactionNotFoundException {
        if(this.reactionService.getById(id) == null) throw new ReactionNotFoundException(id);
        this.reactionService.deleteById(id);
    }
}
