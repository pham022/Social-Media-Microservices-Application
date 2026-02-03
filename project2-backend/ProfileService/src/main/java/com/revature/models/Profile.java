package com.revature.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.revature.utils.SecurityUtil;
import jakarta.persistence.*;
import lombok.*;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * The class is the definition of our Profile model
 *
 * @author Jesse Rodriguez
 */
@Entity
@Table(name = "profile")
@Data
@AllArgsConstructor
@EqualsAndHashCode(exclude = { "following" })
@ToString(exclude = { "following" })
public class Profile {
	@Id
	@Column(name = "profile_id")
	private Long pid;
	@Column(name = "username", columnDefinition = "TEXT", nullable = false, unique = true)
	private String username;
	@Column(name = "password", columnDefinition = "TEXT", nullable = false, unique = true)
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String password;
	@Column(name = "first_name", columnDefinition = "TEXT")
	private String firstName;
	@Column(name = "last_name", columnDefinition = "TEXT")
	private String lastName;
	@Column(name = "bio", columnDefinition = "TEXT")
	private String bio;
	@Column(name = "verification", columnDefinition = "BOOLEAN", nullable = false)
	private boolean verification = false;
	@Column(name = "imgurl", columnDefinition = "TEXT")
	private String imgurl;
	@Column(name = "following")
	@ManyToMany
	@JsonIgnore
	private List<Profile> following = new LinkedList<>();

	public Profile() {
		super();
		pid = SecurityUtil.getId();
	}

	public Profile(Long pid, String username, String password, String firstName, String lastName, String bio, boolean verification) {
		this.pid = pid;
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.bio = bio;
		this.verification = verification;
	}

	public Profile(String username, String password, String firstName, String lastName, String bio, boolean verification) {
		pid = SecurityUtil.getId();
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.bio = bio;
		this.verification = verification;
	}

	public Profile(String username, String password) {
		pid = SecurityUtil.getId();
		this.username = username;
		this.password = password;
		this.firstName = "";
		this.lastName = "";
		this.bio = "";
	}
}
