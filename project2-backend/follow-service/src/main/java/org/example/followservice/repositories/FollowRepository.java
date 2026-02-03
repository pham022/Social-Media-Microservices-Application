package org.example.followservice.repositories;

import org.example.followservice.models.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

    public interface FollowRepository extends JpaRepository<Follow, Long> {

        boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);

        void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);

        List<Follow> findByFollowerId(Long followerId);     // who I follow
        List<Follow> findByFollowingId(Long followingId);   // who follows me

        long countByFollowerId(Long followerId);
        long countByFollowingId(Long followingId);
    }

