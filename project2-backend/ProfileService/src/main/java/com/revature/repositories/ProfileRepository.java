package com.revature.repositories;

import com.revature.models.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * The class is a repository for the Profile model
 *
 * @author Jesse Rodriguez
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Profile getProfileByPid(Long pid);
    Profile getProfileByUsername(String username);
}
