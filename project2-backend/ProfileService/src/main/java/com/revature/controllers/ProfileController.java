package com.revature.controllers;

import com.revature.aspects.annotations.NoAuthIn;
import com.revature.dtos.ProfileDTO;
import com.revature.models.Profile;
import com.revature.services.ProfileService;
import com.revature.utils.SecurityUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * The class is a controller for the Profile model
 *
 * @author Jesse Rodriguez
 */
@Log4j2
@RestController
@RequestMapping("/profiles")
@CrossOrigin(origins = "*")
public class ProfileController {

    private static final String TOKEN_NAME = "Authorization";

    @Autowired
    private ProfileService profileService;

    /**
     * COMMENTED OUT - Registration is now handled by AuthService
     * AuthService will call POST /profiles endpoint instead
     */


    /**
     * Create a new profile (called by AuthService after registration)
     * Matches: ProfileRestClientService.createProfile()
     *
     * @param profile profile to be created
     * @return newly created profile with HttpStatus.CREATED
     */
    @NoAuthIn
    @PostMapping
    public ResponseEntity<ProfileDTO> createProfile(@RequestBody ProfileDTO profile) {
        Profile newProfile = profile.toProfile();

        // Check if username already exists
        Profile existingProfile = profileService.getProfileByUsername(newProfile.getUsername());
        if (existingProfile != null) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409 - username already taken
        }

        // Create the profile
        Profile createdProfile = profileService.addNewProfile(newProfile);

        if (createdProfile == null) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        ProfileDTO profileDto = new ProfileDTO(createdProfile);
        return new ResponseEntity<>(profileDto, HttpStatus.CREATED);
    }

    /**
     * Get profile by username (called by AuthService during login)
     * Matches: ProfileRestClientService.getProfileByUsername()
     *
     * @param username username of the profile to retrieve
     * @return ProfileDTO with HttpStatus.OK or HttpStatus.NOT_FOUND
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<ProfileDTO> getProfileByUsername(@PathVariable("username") String username) {
        Profile profile = profileService.getProfileByUsername(username);

        if (profile != null) {
            return new ResponseEntity<>(new ProfileDTO(profile), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Get Mapping that grabs the profile by the path variable id. It then returns the profile if it is valid.
     *
     * @param id id for profile we are dealing with
     * @return Profile object with HttpStatusAccepted or HttpStatusBackRequest
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProfileDTO> getProfileByPid(@PathVariable("id") Long id) {
        Profile profile = profileService.getProfileByPid(id);
        if (profile != null) {
            return new ResponseEntity<>(new ProfileDTO(profile), HttpStatus.ACCEPTED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Put mapping grabs the updated fields of profile and updates the profile in
     * the database.
     * If no token is sent in the token it fails the Auth and doesn't update the
     * profile.
     *
     * @param profile profile we are dealing with
     * @return Updated profile with HttpStatus.ACCEPTED otherwise if invalid returns HttpStatus.BAD_REQUEST
     */
    @PutMapping
    public ResponseEntity<ProfileDTO> updateProfile(@RequestBody ProfileDTO profile) {
        Profile result = profileService.updateProfile(profile.toProfile());
        if (result != null) {

            Profile pro = new Profile();
            pro.setPid(result.getPid());
            pro.setUsername(result.getUsername());
            pro.setPassword(result.getPassword());
            pro.setFirstName(result.getFirstName());
            pro.setLastName(result.getLastName());
            pro.setBio(result.getBio());

            return new ResponseEntity<>(new ProfileDTO(pro), HttpStatus.ACCEPTED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    /**
     * Retrieved a page of profiles
     *
     * @param pageNumber pageNumber to be retrieved
     * @return page of profiles for page number requested
     */
    @GetMapping("/page/{pageNumber}")
    public ResponseEntity<List<ProfileDTO>> getAllPostsbyPage(@PathVariable("pageNumber") int pageNumber) {
        List<Profile> profiles = profileService.getAllProfilesPaginated(pageNumber);
        List<ProfileDTO> profileDtos = new LinkedList<>();
        profiles.forEach(p -> profileDtos.add(new ProfileDTO(p)));
        return new ResponseEntity<>(profileDtos, HttpStatus.OK);
    }

    /**
     * Search all fields function in profile
     *
     * @param query Takes in a String without space at end point /search{query}
     * @return List <Profile> matching search query
     */
    @GetMapping("/search/{query}")
    public ResponseEntity<List<ProfileDTO>> search(@PathVariable("query") String query){
        log.info("/search hit");
        List<Profile> profiles = profileService.search(query);
        List<ProfileDTO> profileDtos = new LinkedList<>();
        profiles.forEach(p -> profileDtos.add(new ProfileDTO(p)));
        return new ResponseEntity<>(profileDtos, new HttpHeaders(), HttpStatus.OK);
    }
}