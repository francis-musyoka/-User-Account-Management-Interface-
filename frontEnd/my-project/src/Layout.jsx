import React from 'react'
import {NavLink, Outlet} from 'react-router-dom'
import './my.css'

function Layout() {
  return (
    <div>
        <ul className='topnav '>
            <li>
                <NavLink className='nav' to= 'signin'>
                    SignIn
                </NavLink>
            </li>
            <li>
            <NavLink className='nav' to= 'signup'>
                Sign Up
            </NavLink>
        </li>
        </ul>

        <main>
         <Outlet/>
        </main>
      
    </div>
  )
}

export default Layout