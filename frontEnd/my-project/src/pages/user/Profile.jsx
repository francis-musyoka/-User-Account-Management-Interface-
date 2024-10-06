import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance, PATHS_URL, POST_ROUTES } from '../../constants';

import '../../../public/css/profile.css'

import { useAuth } from '../../utils/AuthContext';
import { toast } from 'react-toastify';

function Profile() {
 
    const{logOut,user} = useAuth();

    const handleClick = async()=>{
      const confirm = window.confirm("Do you want to deactivate your account?")
      if(confirm){
        try {
          const response = await axiosInstance.post(POST_ROUTES.DEACTIVATE_ACCOUNT)
          if(response.data.success===true){
            alert("Account deactivated successfully.")
            logOut()
          }
        } catch (error) {
          console.log(error);
          
          toast.error(error.response.data.error)
        }
      }else{
        alert("You cancelled account deactivation.")
      }
    }

    return (
        <div className="user-container">
        
          <div className="user-details">
            <h1 className="user-greeting">Hello {user.userName}</h1>
            <p className="user-info">Username: {user.userName}</p>
            <p className="user-info">Email: {user.email}</p>
            <p className="user-info">Full Name: {user.fullName}</p>
          </div>
          <div>
            <p className="profile-update">Update Your Profile <Link to={PATHS_URL.UPDATEUSERDETAILS} className="profile-link">Click Here!</Link></p>
            <p className="password-change">Change Password <Link to={PATHS_URL.CHANGEPASSWORD} className="profile-link">Click Here!</Link></p>  
          </div>
          
          <button className="deactivate-btn" onClick={handleClick} >
            Deactivate Account
          </button>
          
              
       
      </div>
    )
}
  

export default Profile;