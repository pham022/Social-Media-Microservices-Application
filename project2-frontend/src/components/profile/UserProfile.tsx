import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext, Profiles, Profile } from '../../types/profile';
import axios from 'axios';
import API_URLS from '../../util/url';
import styles from "./Profile.module.css";
import { useAuth } from '../../hooks/useAuth';
import { Avatar, Button } from '@mui/material';
import { Delete as MuiDelete, CloudUpload as MuiUpload } from '@mui/icons-material';
import styled from "styled-components";

export default function UserProfile() {

    const UploadIcon = styled(MuiUpload)``;
    const DeleteIcon = styled(MuiDelete)``;
    // useNavigate() returns a function that lets us programmatically redirect:
    // receive context:
    const ctx = useContext(AuthContext);
    const {user} = useAuth();
    console.log("Auth context user:", ctx);
    if(user){
      console.log("Logged in user:", user);
    }
    
      const [account, setAccount] = useState<Profile>(
    {
      username: user?.username || "",
      email: user?.email || "",
      password: user?.password || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || ""  ,
      bio: user?.bio || "",
      imgurl: user?.imgurl || ""
    });
    const [followers, setFollowers] = useState<Profiles>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
      username: user?.username || "",
      password: user?.password || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || ""  ,
      bio: user?.bio || "",
      imgurl: user?.imgurl || ""
    });

  useEffect(() => {

    if(user?.id){
      axios.get(`${API_URLS.profile}/profiles/${user?.id}`)
        .then(response => { setFormData({...formData, username:user?.username, password: user?.password});setAccount(response.data)})
        .catch(error => console.error(error))
    }
  }, [user?.id]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!account) return;
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
    
    const newImage = event.target?.files?.[0];

    if (newImage) {
      console.log(URL.createObjectURL(newImage));
      setFormData({...formData, imgurl: URL.createObjectURL(newImage)});
      setAccount({...account, imgurl: URL.createObjectURL(newImage)});

    }
    console.log("Form data updated:", formData);
  }
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      console.log("Handle click called");
      console.log("Current imgurl:", account.imgurl);
    if (account.imgurl) {
      event.preventDefault();
      setFormData({ ...formData, imgurl: "" });
      setAccount({...account, imgurl: ""});
      console.log("Image deleted");
    }
  };

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!account) return;
    console.log("Submitting form data:", formData);
    axios.put(`${API_URLS.profile}/profiles`, formData)
      .then(response => {
        console.log(response.data);
        setAccount(response.data);
        setShowCreateForm(false);
      })
      .catch(error => console.error(error))
  }

  return account ? (
    <div className={styles.wrapper}>
            <h2 className={styles.title}>My Profile</h2>
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', scale: '3', gap: '20px', marginBottom: '50px', marginTop: '45px'}}>
                <Avatar variant="circular" src={account.imgurl} />
            </div>
             {showCreateForm && (
              <>
               <input
              accept="image/*"
              hidden
              id="avatar-image-upload"
              type="file"
              onChange={onChangeHandler}
            />
            <label htmlFor="avatar-image-upload">
              <Button
                variant="contained"
                color="primary"
                component="span"
                onClick={handleClick}
              >
                {account.imgurl ? <DeleteIcon /> : <UploadIcon/>}
                {account.imgurl ? "Delete" : "Upload"}
              </Button>
            </label>
              </>
             )}
           
            <div className={styles.field}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }} onChange={onChangeHandler}>
              Name: {account.firstName} {account.lastName}
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }} onChange={onChangeHandler}>
              Bio: {account.bio}
            </div>
            <button
              className={styles.btn}
              onClick={() => setShowCreateForm((prev) => !prev)}>
                {showCreateForm ? "Close Form" : "Update Profile"}
            </button>
          </div>
            {showCreateForm && (
              <form onSubmit={onSubmitHandler} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <label className={styles.label} htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={onChangeHandler}
                  />
                  <label className={styles.label} htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={onChangeHandler}
                  />
                  <label className={styles.label} htmlFor="bio">
                    Bio
                  </label>
                  <input
                    name="bio"
                    placeholder="bio"
                    value={formData.bio}
                    onChange={onChangeHandler}
                  />
                  <button type="submit" className={styles.btn}>
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
  ) : (
    <h1 className={styles.loading}>Loading</h1>
  );
}
