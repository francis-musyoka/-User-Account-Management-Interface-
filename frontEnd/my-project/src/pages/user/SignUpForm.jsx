import React, { useEffect } from 'react'
import '../../../public/css/signUp.css'
import { useState, } from 'react';
import { validateSignUpForm } from '../../utils/validateAllForms';


function SignUpForm(props ) {
  const {hidden=[], onSubmitHandler,formAction,initialValues} = props
  const[inputValues,setInputValues] =useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""

  })
  const [formErrors, setFormErrors] = useState({})
  const [showPassword,setShowPassword] = useState(false)

  
      // Function to check validation of the form
    const validation =(hiddenElement)=>{
      let errors = validateSignUpForm(
        inputValues.userName,
        inputValues.fullName,
        inputValues.email,
        inputValues.password,
        inputValues.confirmPassword,
        hiddenElement
      ); // store our errors
      setFormErrors(errors)
      return Object.keys(errors).length < 1;
    }


    const handleChange = (e)=>{
      const{name,value} = e.target
      setInputValues({...inputValues, [name]: value})
    };


    useEffect(() => {
      if (initialValues) {
        setInputValues(initialValues);
      }
    }, [initialValues]);
  

    const handleSubmit =async(e) => {
      e.preventDefault();
      let isValid = validation(hidden);
      if (isValid) {
        onSubmitHandler(inputValues)
      }
    };
  
  return (
    <div className='main-4'>
    <div className="App-4">
    <form  onSubmit={handleSubmit}>

      <div className="form-group-4">
        <label htmlFor='userName' className="form-label-4">User Name</label>
        <input 
          className="form-control-4" 
          name='userName'
          type='text' 
          value={inputValues.userName} 
          onChange= {handleChange}
        />
        <div className='not-Valid-4'>{formErrors.userName}</div>
      </div>

      <div className="form-group-4">
        <label htmlFor="fullname" className="form-label-4">FullName</label>
        <input 
          className="form-control-4" 
          name='fullName'
          type='text' 
          value={inputValues.fullName} 
          onChange= {handleChange}
        />
        <div className='not-Valid-4'>{formErrors.fullName}</div>
      </div>

      <div className="form-group-4">
        <label htmlFor="email" className="form-label-4">Email</label>
        <input 
          className="form-control-4" 
          name='email' 
          value={inputValues.email} 
          onChange= {handleChange}
        />
        <div className='not-Valid-4'>{formErrors.email}</div>
      </div>

      {!hidden.includes('password') && (
        <>
        
        <div className="form-group-4">
        <label htmlFor="password" className="form-label-4">Password</label>
        <input 
          className="form-control-4" 
          name='password'
          type= {showPassword? 'text' : 'password'} 
          value={inputValues.password} 
          onChange= {handleChange}
        />
        <div className='not-Valid-4'>{formErrors.password}</div>
      </div>

      <div className="form-group-4">
        <label htmlFor="confirmPassword" className="form-label-4">Confirm Password</label>
        <input 
          className="form-control-4" 
          name='confirmPassword'
          type= {showPassword? 'text' : 'password'} 
          value={inputValues.confirmPassword} 
          onChange= {handleChange}
        />
        <div className='not-Valid-4'>{formErrors.confirmPassword}</div>
      </div>

     <div > 
     <input
        type={'checkbox'}
        checked={showPassword}
        onChange ={()=>setShowPassword(!showPassword)}
        className='checkbox-4'
      /> Show Password
     </div>
        
        </>
      )}

     {formAction}
     
    </form>
    </div>
    </div>
  )
}

export { SignUpForm }