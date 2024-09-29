import React from 'react'
import {NavLink, useNavigate,Link} from 'react-router-dom'
import { useAuth } from '../../utils/AuthContext'
import '../../../public/css/navBar.css'
import { PATHS_URL } from '../../constants';


function Navbar() {
  const {token,logOut,user} =useAuth()

    const navBarStyles = ({isActive}) =>{
        return{
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration: isActive ? 'none' : 'normal'
        }
    }

  return (
    <div>
    <nav className='primary-nav'>
        {/* NavLink is used where we want to highlight the currently active link */}
        <NavLink style={navBarStyles} to={PATHS_URL.HOME}>Home</NavLink>
        <NavLink style={navBarStyles} to ={PATHS_URL.ABOUT}>About</NavLink>
        {
          token && user.role ==="Admin" ? <NavLink style={navBarStyles} to={PATHS_URL.DASHBOARD}>Dashboard</NavLink>   :  null
        }
        {
          token ? <NavLink style={navBarStyles} to={PATHS_URL.PROFILE}>Profile</NavLink>   :  null
        }
        {
          !token ? null :  <Link className={'signin'}  onClick={logOut}> LogOut</Link>
        }
        {
          !token ? <NavLink className={'signin'} style={navBarStyles} to={PATHS_URL.SIGNIN} >SignIn</NavLink> : null
        }

    </nav>
    </div>
  )
}

export default Navbar


