import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext, Profiles, Profile } from '../../types/profile';
import axios from 'axios';
import API_URLS from '../../util/url';
import styles from "./Profile.module.css";
import { useAuth } from '../../hooks/useAuth';
import CreatePost from '../posts/CreatePost';
import { Avatar, Button } from '@mui/material';
import { Delete as MuiDelete, CloudUpload as MuiUpload } from '@mui/icons-material';
import styled from "styled-components";


const UploadIcon = styled(MuiUpload)``;
const DeleteIcon = styled(MuiDelete)``;

export default function UserProfile() {
  const {user} = useAuth();
  const [account, setAccount] = useState<Profile>(
    {       
      username: user?.username || "",
      email: "",
      password: user?.password || "",
      firstName: "",
      lastName: "",
      bio: "",
      imgurl: ""
    });
    // useNavigate() returns a function that lets us programmatically redirect:
    const navigate = useNavigate();
    // receive context:
    const ctx = useContext(AuthContext);
    
    let id = user?.id || user?.profileId;
    const [followers, setFollowers] = useState<Profiles>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
      id: id,
      username: user?.username || "",
      password: user?.password || "",
      firstName: "",
      lastName: "",
      bio: "",
      imgurl: ""
    });

  useEffect(() => {
    if(id){
      axios.get(`${API_URLS.profile}/profiles/${id}`)
        .then(response => { 
          console.log(response.data);
          setAccount(response.data);
          setFormData({
            ...formData,
            username: user?.username || "",
            password: user?.password || "",
            firstName: response.data.firstName || "",
            lastName: response.data.lastName || "",
            bio: response.data.bio || "",
            imgurl: response.data.imgurl || ""
          });
        })
        .catch(error => console.error(error))
    }
  }, [id]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!account) return;
    
    // Handle file input for image upload
    if (event.target.type === 'file') {
      const newImage = event.target.files?.[0];
      if (newImage) {
        // Convert to data URL for both preview and backend submission
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          setFormData({...formData, imgurl: dataUrl});
          setAccount({...account, imgurl: dataUrl});
        };
        reader.readAsDataURL(newImage);
      }
      return;
    }
    
    // Handle regular input fields
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleDeleteImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (account.imgurl) {
      setFormData({ ...formData, imgurl: "" });
      setAccount({...account, imgurl: ""});
    }
  };

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!account) return;
    axios.put(`${API_URLS.profile}/profiles`, formData)
      .then(response => {
        console.log(response.data);
        setAccount(response.data);
        setShowCreateForm(false);
      })
      .catch(error => console.error(error))
  }

  const handlePostCreated = () => {
    // Refresh profile or navigate to feed
    navigate('/feed');
  };

  return account ? (
    <div className={styles.profileContainer}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>My Profile</h2>
        
        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <Avatar 
            src={account.imgurl} 
            className={styles.profileAvatar}
            sx={{ width: 120, height: 120, bgcolor: '#3b82f6' }}
          >
            {!account.imgurl && (account.firstName?.[0] || account.lastName?.[0] || account.username?.[0] || 'U').toUpperCase()}
          </Avatar>
          {showCreateForm && (
            <div className={styles.avatarControls}>
              {account.imgurl ? (
                <Button
                  variant="contained"
                  className={styles.avatarButton}
                  onClick={handleDeleteImage}
                >
                  <DeleteIcon /> Delete
                </Button>
              ) : (
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
                      component="span"
                      className={styles.avatarButton}
                    >
                      <UploadIcon /> Upload
                    </Button>
                  </label>
                </>
              )}
            </div>
          )}
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Name:</span>
            <span className={styles.infoValue}>
              {account.firstName || account.lastName 
                ? `${account.firstName || ''} ${account.lastName || ''}`.trim()
                : 'Not set'}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Bio:</span>
            <span className={styles.infoValue}>
              {account.bio || 'No bio yet'}
            </span>
          </div>
          <div className={styles.buttonContainer}>
            <button
              className={styles.btn}
              onClick={() => setShowCreateForm((prev) => !prev)}>
              {showCreateForm ? "Close Form" : "Update Profile"}
            </button>
          </div>
        </div>
        {showCreateForm && (
          <form onSubmit={onSubmitHandler} className={styles.updateForm}>
            <div className={styles.formFields}>
              <div className={styles.formField}>
                <label className={styles.label} htmlFor="firstName">
                  First Name
                </label>
                <input
                  name="firstName"
                  className={styles.input}
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={onChangeHandler}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label} htmlFor="lastName">
                  Last Name
                </label>
                <input
                  name="lastName"
                  className={styles.input}
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={onChangeHandler}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label} htmlFor="bio">
                  Bio
                </label>
                <input
                  name="bio"
                  className={styles.input}
                  placeholder="Bio"
                  value={formData.bio}
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.btn}>
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className={styles.createPostSection}>
        <CreatePost onPostCreated={handlePostCreated} />
      </div>
    </div>
  ) : (
    <h1 className={styles.loading}>Loading</h1>
  );
}
