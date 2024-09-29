import React from 'react'
import '../../../public/css/signUp.css'
import { PATHS_URL, API_HOST,POST_ROUTES} from '../../constants';
import { Link,useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import {SignUpForm} from './SignUpForm'


function SignUp() {
    const navigate =useNavigate()
    
    const handleSubmit =async(formData) => {
      try {
        const response =await axios.post(`${API_HOST}${POST_ROUTES.SIGN_UP}`,formData)
        console.log(response);
        if(response.data.success === true){
          navigate(PATHS_URL.SIGNIN)
          toast.success('Successfully sign up')
        }
        
      } catch (error) {
        toast.success(error.response.data.error)
      }
    };

    const FormAction = ()=>{
      return (
        <>
        <div className="form-group-4">
          <button className="btn-4" type="submit" >Sign Up</button>
        </div>

        <p className="btn-14">Already have account? 
          <Link to={PATHS_URL.SIGNIN} >Click here!</Link>
        </p>
        </>
      )
    }
  return (
   <SignUpForm onSubmitHandler={handleSubmit} formAction={<FormAction/>}/>
 
  )
}

export default SignUp