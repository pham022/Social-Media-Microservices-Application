package org.revature.comreact.exceptions;

public class CommentNotFoundException extends Exception {
    public CommentNotFoundException(Long id) {
        super("Comment not found with id: " + id);
    }
}
