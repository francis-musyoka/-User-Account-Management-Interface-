import React, { useState ,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS_URL ,API_HOST,PUT_ROUTES} from '../../constants';
import { validateChangePasswordForm } from '../../utils/validateAllForms';
import { useAuth } from '../../utils/AuthContext';
import '../../../public/css/changePassword.css'
import { toast } from 'react-toastify';
import axios from 'axios';



const ChangePassword = () => {
    const [showPassword,setShowPassword]=useState(false);
    const [currentPassword,setCurrentPassword]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState('');
    const [formErrors,setFormErrors] =useState('');
    

    const {user}= useAuth();
    const navigate=useNavigate();

    const validateForm = ()=>{
        const errors = validateChangePasswordForm(currentPassword,password,confirmPassword);
        setFormErrors(errors);
        console.log(errors);
        return Object.keys(errors).length < 1;
    };
        
    const handleSubmit=async(e)=>{
        e.preventDefault();

        const isFormValid = validateForm();

        console.log(isFormValid);

        if(isFormValid){
            try {
                const response = await axios.put(`${API_HOST}${PUT_ROUTES.UPDATE_USER_PASSWORD(user._id)}`,{currentPassword,password,confirmPassword},{withCredentials:true}) 
                if(response.status===200){
                    navigate(PATHS_URL.PROFILE)
                    toast.success('Successfully updated your password')
                }
             } catch (error) {
                console.log(error);
                toast.error(error.response.data.error)
                
             };
        } ;   
    };
    

    return (
        <>
            <div className='page-container '>
                
                <div className='form-container-5 '>
                <p className='paragraph'>Protect your account with a unique password at least 6 characters long.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-5">
                        <label htmlFor="Current Password<" className="form-label-5">Current Password</label>
                        <input 
                            className="form-control-5" 
                            type= {showPassword? 'text' : 'password'} 
                            value={currentPassword} 
                            onChange= {(e)=>setCurrentPassword(e.target.value)}
                        />
                        <div className='not-Valid-5'>{formErrors.currentPassword}</div>
                    </div>
                    <div className="form-group-5">
                        <label htmlFor="New Password" className="form-label-5">New Password</label>
                        <input 
                            className="form-control-5" 
                            type= {showPassword? 'text' : 'password'} 
                            value={password} 
                            onChange= {(e)=>setPassword(e.target.value)}
                        />
                        <div className='not-Valid-5'>{formErrors.password}</div>
                    </div>

                    <div className="form-group-5">
                        <label htmlFor="confirmPassword" className="form-label-5">Re-Enter New Password</label>
                        <input 
                            className="form-control-5" 
                            type= {showPassword? 'text' : 'password'} 
                            value={confirmPassword} 
                            onChange= {(e)=>setConfirmPassword(e.target.value)}
                        />
                        <div className='not-Valid-5'>{formErrors.confirmPassword}</div>
                    </div>
                    <div className="checkbox-container-5"> 
                        <input
                            type={'checkbox'}
                            checked={showPassword}
                            onChange ={()=>setShowPassword(!showPassword)}
                            className='checkbox-5'
                        /> Show Password
                    </div>
                    <div>
                        <button className='btn-5' type='submit'>Update Password</button>
                    </div>
                </form>
                </div>
            </div>
        </>
    );
};







export default ChangePassword;
