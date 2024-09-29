import React, { useState } from 'react';
import '../../../public/css/editUserModal.css'


const EditUserModal = ({closeModal,userData,onSubmit}) => {
   
    const [userDetails,setUserDetails] = useState({
        userName: userData.userName || '',
        fullName: userData.fullName || '',
        email: userData.email || '',
        role: userData.role || '',
    })
    

    const handleChange = (e)=>{
        const{name,value} = e.target;
        setUserDetails({
            ...userDetails,
                [name]: value
            }
        )
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        onSubmit(userDetails)
        
    }

    return (
        <>
            <div className="modal-container">
                <div className="modal-box">
                    <h2 className="modal-title">Edit User Details</h2>
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="userName" className="form-label">User Name</label>
                            <input 
                            type="text"
                            name="userName"
                            value={userDetails.userName}
                            onChange={handleChange}
                            className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <input 
                            type="text" 
                            name="fullName"
                            value={userDetails.fullName}
                            onChange={handleChange} 
                            className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input 
                            type="email" 
                            name="email"
                            value={userDetails.email}
                            onChange={handleChange}
                            className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role" className="form-label">Role</label>
                            <select className="form-select" name="role" value={userDetails.role} onChange={handleChange}>
                                <option value={userDetails.role}>{userDetails.role}</option>
                                {userDetails.role === 'User' ? (
                                     <option value="Admin">Admin</option>
                                ) : (
                                    <option value="User">User</option>
                                )}
                            </select>
                        </div>
                        <div className="button-group">
                            <button type="button" className="btn cancel-btn" onClick={closeModal}>
                                Cancel
                            </button>
                            <button type="submit" className="btn save-btn">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </>

    );
}

export default EditUserModal;
