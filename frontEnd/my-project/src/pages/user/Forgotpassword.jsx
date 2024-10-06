import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../public/css/forgotpassword.css'
import { API_HOST, PATHS_URL,POST_ROUTES,axiosInstance } from '../../constants';
import { toast } from 'react-toastify';
import { validateForgotPasswordForm } from '../../utils/validateAllForms';
import axios from 'axios';



function Forgotpassword() {
    const [email, setEmail] = useState('')
    const [formError, setFormError] = useState('');

    const navigate = useNavigate();

    // Validate Form
    const validateForm =()=>{
      const error = validateForgotPasswordForm(email);

      setFormError(error)

      return Object.keys(error).length < 1;
    }

    // Handle submit
    const handleClick =async()=>{

      const isValid =validateForm();

      if(isValid){
        try {
          const response = await axios.post(`${API_HOST}${POST_ROUTES.FORGOT_PASSWORD}`,{email});

          if(response.data.success){

            toast.success(`An email with link to reset your password has been sent to ${email}.`);

            navigate(PATHS_URL.SIGNIN);

            setEmail('');
          }
        } catch (error) {
          toast.error(error.response.data.error)
        };
      };
        
    };

    return (
      <div>
        
          <div className="container-2">
              <p className='p-2'>Enter your email.</p> 
                <input 
                  type={'text'} 
                  value={email}
                  placeholder= 'Email' 
                  onChange={(e)=> setEmail(e.target.value)}
                  className="form-control-2"
                />
                <div className='not-Valid-4'>{formError.email}</div>
              <button 
                  className='btn-2' 
                  type='submit' 
                  onClick={handleClick}
                >
                  Next
                </button>
          </div>

      </div>
    )
}

export default Forgotpassword