import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext, Profiles, Profile } from '../../types/profile';
import axios from 'axios';
import API_URLS from '../../util/url';
import styles from "./Profile.module.css";
import { useAuth } from '../../hooks/useAuth';


export default function UserProfile() {
  const [account, setAccount] = useState<Profile>(
    {       
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      bio: "",
      profilePic: "" 
    });
    // useNavigate() returns a function that lets us programmatically redirect:
    const navigate = useNavigate();
    // receive context:
    const ctx = useContext(AuthContext);
    const {user} = useAuth();
    let id = user?.profileId;
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

  return account ? (
    <div className={styles.wrapper}>
            <h2 className={styles.title}>My Profile</h2>
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
