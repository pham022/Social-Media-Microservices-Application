package org.revature.comreact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private Long pid;
    private String username;
    private String firstName;
    private String lastName;
    private String bio;
    private boolean verification;
    private String imgurl;
}