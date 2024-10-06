import React, { useEffect } from 'react';
import { useLocation,Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { PATHS_URL,API_HOST } from '../../constants';


function RequireAuth() {
   const {token} = useAuth();
   const navigate = useNavigate()

   useEffect(()=>{
    if(!token) return navigate(PATHS_URL.SIGNIN)   
   },[token,navigate])   
 
   return  <Outlet/>    
  
  
}

export default RequireAuth