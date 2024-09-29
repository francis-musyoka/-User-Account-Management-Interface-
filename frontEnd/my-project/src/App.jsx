

import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Home from './pages/Home page/Home';
import SignIn from './pages/SignIn page/SignIn';
import SignUp from './pages/SignUp page/SignUp';
import Forgotpassword from './pages/Forgotpassword/Forgotpassword';
import AuthProvider from './utils/AuthContext';
import RequireAuth from './pages/RequireAuth';
import Navbar from './pages/Navbar/Navbar';
import About from './pages/About page/About';
import Profile from './pages/Profile page/Profile';
import UpdateUserDetails from './pages/UpdateUserDetails';
import ResetPassword from './pages/ResetPassword';
import { PATHS_URL } from './constants';
import ChangePassword from './pages/ChangePassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashBoard from './pages/admin/DashBoard';

function App() {
  return (
   
    <BrowserRouter>
    <ToastContainer/>
      <AuthProvider >
        <Navbar/>
          <Routes>
          <Route path={PATHS_URL.HOME} element = {<Home/>}/>
          <Route path={PATHS_URL.ABOUT} element={<About/>}/>
          <Route element={<RequireAuth/>}>
           <Route path={PATHS_URL.PROFILE} element={<Profile/>}/>
           <Route path={PATHS_URL.DASHBOARD} element={<DashBoard/>}/>
          </Route>
          <Route path={PATHS_URL.SIGNIN} element = {<SignIn/>}/>
          <Route path={PATHS_URL.SIGNUP} element = {<SignUp/>}/>
          <Route path={PATHS_URL.UPDATEUSERDETAILS} element={<UpdateUserDetails/>}/>
          <Route path ={PATHS_URL.FORGOTPASSWORD} element ={<Forgotpassword/>}/>
          <Route path={PATHS_URL.RESETPASSWORD}  element ={<ResetPassword/>}/>
          <Route path={PATHS_URL.CHANGEPASSWORD} element={<ChangePassword/>}/>
         
          </Routes>
      </AuthProvider>
   </BrowserRouter>
   
    
  )
}

{/* <AuthRouteGuard role={ADMIN_ROLE}><Home/></AuthRouteGuard> */}



export default App
