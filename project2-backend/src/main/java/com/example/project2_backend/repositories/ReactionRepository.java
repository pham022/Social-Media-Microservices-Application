package com.example.project2_backend.repositories;

import com.example.project2_backend.entities.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {

    @Query(value = "select * from reaction where postId = :id", nativeQuery = true)
    List<Reaction> getByPostId(@Param("id") Long id);
}
