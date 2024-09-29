import React from 'react'
import { useState } from 'react';
// import { checkEmailExistence } from '../../utils/userExist';
import { useNavigate } from 'react-router-dom';
import '../../../public/css/forgotpassword.css'
import { PATHS_URL,API_HOST,POST_ROUTES } from '../../constants';
import axios from 'axios';
import { toast } from 'react-toastify';


function Forgotpassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('');

    const navigate = useNavigate()

    const handleClick =async()=>{
        try {
          const response = await axios.post(`${API_HOST}${POST_ROUTES.FORGOT_PASSWORD}`,{email})
          if(response.data.success){
            toast.success(`An email with link to reset your password has been sent to ${email}.`)
            navigate(PATHS_URL.SIGNIN)
            setEmail('')
          }
        } catch (error) {
          toast.error(error.response.data.error)
        }
    }

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
              <button 
                  className='btn-2' 
                  type='submit' 
                  onClick={handleClick}
                >
                  Next
                </button>

              {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>

      </div>
    )
}

export default Forgotpassword