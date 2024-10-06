import React from 'react'
import '../../../public/css/update.css'
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS_URL,PUT_ROUTES, axiosInstance} from "../../constants";
import { useAuth } from '../../utils/AuthContext';
import { SignUpForm } from './SignUpForm';
import { toast } from 'react-toastify';


function UpdateUserDetails() {
    const[inputValues,setInputValues]=useState({
        userName: "",
        fullName: "",
        email: ""
    })
    
    const {user} = useAuth()
    const navigate=useNavigate()
 
   
    
    useEffect(() => {
        if(user){
            setInputValues({
                userName: user.userName,
                fullName: user.fullName,
                email: user.email
            });
        }
      },[user]);
  
   
    const handleSubmit = async (values) => {
        const {userName,fullName,email} =values
        try {
            const response = await axiosInstance.put(PUT_ROUTES.UPDATE_USER(user._id),{userName,fullName,email}) 
            if(response.status===200){
                navigate(PATHS_URL.PROFILE)
                toast.success('Successfully updated your profile')
            }
         } catch (error) {
            toast.error(error.response.data.error)
            
         }

    };
    return (
        <>
            <h1 className='h1'>Update your details</h1>
            <SignUpForm 
            initialValues={inputValues}
            onSubmitHandler={handleSubmit} 
            formAction={ <button type='submit' className='btn btn-primary'>Update</button>} 
            hidden={['password']}/>
        </>
    )
}

export default UpdateUserDetails





