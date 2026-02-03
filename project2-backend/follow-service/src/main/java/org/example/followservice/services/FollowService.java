package org.example.followservice.services;

import org.example.followservice.models.Follow;
import org.example.followservice.repositories.FollowRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowService {

    private final FollowRepository repo;

    public FollowService(FollowRepository repo) {
        this.repo = repo;
    }

    public void follow(Long me, Long target) {
        if (me.equals(target)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        if (repo.existsByFollowerIdAndFollowingId(me, target)) return;

        repo.save(new Follow(me, target));
    }

    public void unfollow(Long me, Long target) {
        repo.deleteByFollowerIdAndFollowingId(me, target);
    }

    public List<Long> getFollowingIds(Long userId) {
        return repo.findByFollowerId(userId)
                .stream()
                .map(Follow::getFollowingId)
                .toList();
    }

    public List<Long> getFollowerIds(Long userId) {
        return repo.findByFollowingId(userId)
                .stream()
                .map(Follow::getFollowerId)
                .toList();
    }

    public boolean isFollowing(Long me, Long target) {
        return repo.existsByFollowerIdAndFollowingId(me, target);
    }

    public Counts getCounts(Long userId) {
        return new Counts(
                repo.countByFollowingId(userId),
                repo.countByFollowerId(userId)
        );
    }

    public record Counts(long followers, long following) {}
}
