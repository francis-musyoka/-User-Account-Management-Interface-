import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState} from 'react'
import '../../../public/css/signIn.css'
import { PATHS_URL } from '../../constants';
import { useAuth } from '../../utils/AuthContext';
import { validateLoginForm } from '../../utils/validateAllForms';
import {useLocalstorage} from '../../utils/useLocalStorage';


const SignIn = ()=> {
    const [userName, setUserName] = useLocalstorage('userName', '');
    const [password, setPassword] =  useLocalstorage('password', '');
    const [formErrors, setFormErrors] = useState('');
    const[showPassword,setShowPassword] = useState(false);
    
    const {loginAction} = useAuth()
  
    const validateForm =()=>{
      const errors = validateLoginForm(userName,password);
      setFormErrors(errors)
      console.log(errors);
      
      return Object.keys(errors).length < 1
    }

    // Function to handle form submission
    const submitHandler = async(e)=>{
      e.preventDefault(); 
      const isValid = validateForm();
      if(isValid){
        await loginAction(userName,password)
        return;
      }
    }

 // JSX for rendering the sign-in form
    return (
        <div className='main-3'>
            <div className="App-3">
                <form onSubmit={submitHandler} className='container-3' >
                  <div className="form-group-3">
                    <label htmlFor="userName" className="form-label-3">User Name</label>
                    <input className="form-control-3" type='text' value={userName} onChange ={e=>setUserName(e.target.value)} />
                    <div className='not-Valid-4'>{formErrors.userName}</div>
                  </div>

                  <div className="form-group-3">
                    <label htmlFor="password" className="form-label-3">Password</label>
                    <input className="form-control-3 " 
                      type= {showPassword? 'text':'password'}
                      value={password} 
                      onChange ={e=>setPassword(e.target.value)} 
                    />
                    <div className='not-Valid-4'>{formErrors.password}</div>
                  </div>

                  <input
                    type={'checkbox'}
                    checked= {showPassword}
                    onChange ={()=>setShowPassword(!showPassword)}
                    className='checkbox-3'
                  />
                    Show Password
                  <p className='link-3'>
                    <Link to={PATHS_URL.FORGOTPASSWORD}>Forgot password?</Link>
                  </p>

                  <div className="form-group-3">
                    <button className="btn-3" type="submit" >Sign In</button>
                  </div>

                    <div className="form-group-3">
                      <p className="btn-13"> New User?
                      <Link to={PATHS_URL.SIGNUP}> 
                        Create Account
                      </Link>
                      </p>
                    </div>
                  
                </form>
            </div>
        </div>
    )
}

export default SignIn



