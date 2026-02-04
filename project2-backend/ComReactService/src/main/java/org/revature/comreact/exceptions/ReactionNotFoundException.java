package org.revature.comreact.exceptions;

public class ReactionNotFoundException extends Exception {
    public ReactionNotFoundException(Long id) {
        super("Reaction not found with id: " + id);
    }
}
