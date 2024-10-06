import React from 'react'
import '../../../public/css/resetpassword.css'
import { useState } from 'react';
import { PATHS_URL ,API_HOST,POST_ROUTES} from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import { toast } from 'react-toastify';
import { validateResetPasswordForm } from '../../utils/validateAllForms';

function ResetPassword() {
   
    const [showPassword,setShowPassword] = useState(false)
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [formErrors,setFormErrors] =useState('')
   
    const{token} = useParams()

    const navigate = useNavigate()

    const validateForm =()=>{
        const errors = validateResetPasswordForm(password,confirmPassword);
        setFormErrors(errors);
        console.log(errors);
        return Object.keys(errors).length < 1
    }

    const handleSubmit =async(e)=>{
        e.preventDefault()
        const isValid = validateForm();
        
        if(isValid){
            try {
                const response = await axios.post(`${API_HOST}${POST_ROUTES.RESET_PASSWORD(token)}`,{password,confirmPassword})
                console.log(response.status);
                
                if(response.status===204){
                    setPassword("");
                    setConfirmPassword("");
                    toast.success('Password has been reset successfully');
                    navigate(PATHS_URL.SIGNIN);
                }
                
            } catch (error) {
                toast.error(error.response.data.error)  
            }
        }
       
    }

    return (
        <div> 
            <h1 className='header-1'>Reset your password</h1>
            <form className='container-1' onSubmit={handleSubmit}>
                <div className="form-group-1 ">
                    <label htmlFor='password' className="form-label-1">New Password</label>
                    <input 
                        type={showPassword ? 'text':'password'} 
                        value= {password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className="form-control-1"
                    />
                     <div className='not-Valid-4'>{formErrors.password}</div>
                </div>
                <div className="form-group-1 ">
                    <label htmlFor='confirmPassword' className="form-label-1">Confirm Password</label>
                    <input 
                        type={showPassword ? 'text':'password'}
                        value= {confirmPassword} 
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        className="form-control-1"
                    />
                    <div className='not-Valid-4'>{formErrors.confirmPassword}</div>
                </div>
                <div className="form-group-1 ">
                    <input 
                        type={'checkbox'} 
                        checked={showPassword}
                        onChange={(e)=>setShowPassword(!showPassword)}
                        className="form-check-input-1"
                    /> Show Password
                </div>
                <button className='btn-1' type='submit'>Update</button>
               
              

            
                
            </form>
        </div>
    )
}

export default ResetPassword