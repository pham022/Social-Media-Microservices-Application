package org.revature.repositories;

import org.revature.comreact.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

//    @Query(value = "select * from comment where postId = :id", nativeQuery = true)
    List<Comment> getByPostId(@Param("id") Long id);
}
