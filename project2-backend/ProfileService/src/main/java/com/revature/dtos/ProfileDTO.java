package com.revature.dtos;

import com.revature.models.Profile;
import com.revature.utils.SecurityUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.util.LinkedList;
import java.util.List;

/**
*
* The class is a data transfer object for the Profile model
*
* @author Jesse Rodriguez
*/
@Data
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"following"})
@ToString(exclude = {"following"})
public class ProfileDTO {

	private int pid;

	private String username;

	private String password;

	private String firstName;

	private String lastName;

	private String bio;
	
	private boolean verification;

    private String imgurl;
	
	private List<ProfileDTO> following = new LinkedList<>();

	public ProfileDTO() {
		super();
		pid = SecurityUtil.getId();
	}
	
	public ProfileDTO(Profile profile) {
		if (profile != null) {
			pid = profile.getPid();
			username = profile.getUsername();
			password = profile.getPassword();
			firstName = profile.getFirstName();
			lastName = profile.getLastName();
			bio = profile.getBio();
			verification = profile.isVerification();
			imgurl = profile.getImgurl();
			following = null;
			if (profile.getFollowing() != null) {
				following = new LinkedList<>();
				profile.getFollowing().forEach(f -> following.add(new ProfileDTO(f.getPid(), f.getUsername(),
						f.getPassword(), f.getFirstName(), f.getLastName(), f.getBio(), f.isVerification(), f.getImgurl(), null)));
			}
		}
	}

	public boolean isIncomplete() {
		return this.username == null || this.password == null || this.firstName == null || this.lastName == null
				|| this.bio == null || this.following == null || this.username.isEmpty()
				|| this.password.isEmpty() || this.firstName.isEmpty() || this.lastName.isEmpty() || this.bio.isEmpty()
				|| this.pid < 100;
	}
	
	public Profile toProfile() {
		List<Profile> newFollowing = new LinkedList<>();
		if(following != null) {
			following.forEach(f -> newFollowing.add(f.toProfile()));
		}
		return new Profile(pid, username, password, firstName, lastName, bio, verification, imgurl, newFollowing);
	}

	public ProfileDTO(String username, String password, String firstName, String lastName, String bio, boolean verification,
                      String imgurl, List<ProfileDTO> following){
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.bio = bio;
		this.verification = verification;
		this.imgurl = imgurl;
		this.following = following;
	}
	
}
