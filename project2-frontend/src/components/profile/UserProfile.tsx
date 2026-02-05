import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext, Profiles, Profile } from '../../types/profile';
import axios from 'axios';
import API_URLS from '../../util/url';
import styles from "./Profile.module.css";
import { useAuth } from '../../hooks/useAuth';
import CreatePost from '../posts/CreatePost';


export default function UserProfile() {
  const [account, setAccount] = useState<Profile>(
    {       
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      bio: "",
      imgurl: ""
    });
    // useNavigate() returns a function that lets us programmatically redirect:
    const navigate = useNavigate();
    // receive context:
    const ctx = useContext(AuthContext);
    const {user} = useAuth();
    let id = user?.id;
    const [followers, setFollowers] = useState<Profiles>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
      id: id,
      username: user?.username,
      password: user?.password,
      firstName: "",
      lastName: "",
      bio: "",
      imgurl: ""
    });

  useEffect(() => {

    if(id){
      axios.get(`${API_URLS.profile}/profiles/${id}`)
        .then(response => { console.log(response.data);setAccount(response.data)})
        .catch(error => console.error(error))
    }
  }, [id]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!account) return;
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

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
