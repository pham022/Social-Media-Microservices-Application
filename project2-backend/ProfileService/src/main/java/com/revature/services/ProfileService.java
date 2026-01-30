package com.revature.services;

import com.revature.models.Profile;
import com.revature.repositories.ProfileRepository;
import com.revature.utils.SecurityUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
/**
 *
 * The class contains all of our actions using the repository for the Profile model
 *
 * @author Jesse Rodriguez
 */
@Log4j2
@Service
public class ProfileService {

    @Autowired
    public ProfileRepository profileRepo;

    /**
     * Add User Profile into the Database
     * 
     * @param profile users profile that we are registering
     * @return a big fat load of object
     *
     */
    public Profile addNewProfile(Profile profile) {
        try {
            profile.setPassword(SecurityUtil.hashPassword(profile.getPassword()));
            return profileRepo.save(profile);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Gets User Profile by ID in database
     * 
     * @param pid id of the profile we are looking for
     * @return profile object from database.
     */
    public Profile getProfileByPid(Long pid) {
        return profileRepo.getProfileByPid(pid);
    }

    /**
     * initiates a profile lookup by username in ProfileRepo
     * 
     * @param username username of the profile we are looking for
     * @return profile with the given id if it exists
     */
    public Profile getProfileByUsername(String username) {
        return profileRepo.getProfileByUsername(username);
    }

    /**
     * initiates a profile chanme based on the passed in profile information
     *
     * @param profile profile we are updating
     * @return updated profile if it exists otherwise return null.
     */
    public Profile updateProfile(Profile profile) {
    	log.info(profile);
        Profile targetProfile;
        targetProfile = profileRepo.getProfileByUsername(profile.getUsername());
        log.info("Target Profile: " + targetProfile.toString());
        if (profile.getBio() != null) targetProfile.setBio(profile.getBio());
        if (profile.getFirstName() != null) targetProfile.setFirstName(profile.getFirstName());
        if (profile.getLastName() != null) targetProfile.setLastName(profile.getLastName());
        if (profile.getPassword() != null)
            targetProfile.setPassword(SecurityUtil.hashPassword(profile.getPassword()));
        targetProfile.setVerification(profile.isVerification());
        if (profile.getImgurl() != null) {
            log.info(profile.getImgurl());
            log.error("here we go   " + profile.getImgurl());
            targetProfile.setImgurl(profile.getImgurl());
        }
        return profileRepo.save(targetProfile);
    }

    /**
     * Calls ProfileRepo to remove a profile from following by email
     * 
     * @param profile profile of user initiating request
     * @param username   username of profile to be removed
     * @return profile, null if unsuccessful
     */
    public Profile removeFollowByUsername(Profile profile, String username) {
        Profile unfollow = profileRepo.getProfileByUsername(username);
        if (profile != null) {
            List<Profile> pList = profile.getFollowing();
            if (pList.contains(unfollow)) {
                pList.remove(unfollow);
                profile.setFollowing(pList);
            }
            profileRepo.save(profile);
            return profile;
        } else {
            log.info("Unable to remove follow");
        }
        return null;
    }

    /**
     * Calls ProfileRepo to add a profile o following by email
     * 
     * @param profile profile of user initiating request
     * @param username   username of profile to be removed
     * @return profile, null if unsuccessful
     */
    public Profile addFollowerByUsername(Profile profile, String username) {
        List<Profile> pList = profile.getFollowing();
        Profile followed = profileRepo.getProfileByUsername(username);
        if (followed != null && !followed.equals(profile)) {
            if (!pList.contains(followed)) {
                pList.add(followed);
            }
            profile.setFollowing(pList);
            profileRepo.save(profile);
            return profile;
        }
        return null;
    }


    /**
     * Calls ProfileRepo to get a page of profiles
     *
     * @param page profile of user initiating request
     *
     * @return page of profiles
     */
    public List<Profile> getAllProfilesPaginated(int page) {
        Pageable pageable = PageRequest.of(page - 1, 15, Sort.by("username").ascending());
        Page<Profile> resultPage = profileRepo.findAll(pageable);
        if (resultPage.hasContent()) {
            return resultPage.getContent();
        }
        return new ArrayList<>();
    }


    /**
     * Calls ProfileRepo to get a list of matching profiles.
     * ImageUrl and Pid are ignored when searching.
     * @param query query without spaces
     * @return List <Profile> matching search
     */
	public List<Profile> search(String query) {
		Profile sampleProfile = new Profile();
		sampleProfile.setPid(0L);
		sampleProfile.setFirstName(query);
		sampleProfile.setLastName(query);
		sampleProfile.setUsername(query);
		sampleProfile.setBio(query);
		
		ExampleMatcher ignoringExampleMatcher = ExampleMatcher.matchingAny()
				 .withMatcher("username", ExampleMatcher.GenericPropertyMatchers.startsWith().ignoreCase())
				 .withMatcher("firstName", ExampleMatcher.GenericPropertyMatchers.startsWith().ignoreCase())
				 .withMatcher("lastName", ExampleMatcher.GenericPropertyMatchers.startsWith().ignoreCase())
				 .withMatcher("bio", ExampleMatcher.GenericPropertyMatchers.startsWith().ignoreCase())
				 .withIgnorePaths("pid");
				 
		Example <Profile> example = Example.of(sampleProfile, ignoringExampleMatcher);
		return profileRepo.findAll(example);
	}
}
