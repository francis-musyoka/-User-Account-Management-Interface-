import { createContext,useContext,useState, useEffect } from "react";
// import { checkLoginCredentials, fetchUserData } from "./loginUser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { PATHS_URL,POST_ROUTES,GET_ROUTES, axiosInstance} from "../constants";




const AuthContext = createContext();


const AuthProvider = ({ children }) => {
      const [user, setUser] = useState('');
      const [token, setToken] = useState(sessionStorage.getItem("token") || "");
      
      const navigate = useNavigate()

     
      const refreshAccessToken = async () => {
        
        try {
          const response = await axiosInstance.post(POST_ROUTES.REFRESH_ACCESS_TOKEN);
          if (response.data.success === true) {
            return response.data.accessToken;
          }
        }catch (error) {
          console.log('Failed to refresh token:', error);
          logoutSessionExpired();
          return null;
        }
      };
  
     

      axiosInstance.interceptors.request.use(
        (config)=>{
          if(token){
            config.headers.Authorization=`Bearer ${token}` ;
          }
          return config
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      
      useEffect(() => {
        axiosInstance.interceptors.response.use(
              (response) => {
                  return response;
              },
              async (error) => {
                  const originalRequest = error.config;

                  // Skip refresh token logic during login requests or sign-up requests
              if (originalRequest.url.includes(POST_ROUTES.SIGN_IN) || originalRequest.url.includes(POST_ROUTES.SIGN_UP)) {
                return Promise.reject(error); // Skip refresh token for login
            }
                  console.log(error.response.status);
                  
                  if (error.response && error.response.status === 401 && !originalRequest._retry) {
                      originalRequest._retry = true;
                      const newAccessToken = await refreshAccessToken();
                      console.log(newAccessToken);
                      
                      if (newAccessToken) {
                          setToken(newAccessToken);
                          sessionStorage.setItem('token', response.data.accessToken)
                          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                          return axiosInstance(originalRequest);
                      }
                  }
                  return Promise.reject(error);
              }
        );
  
    }, []); 
   
      useEffect(()=>{
          if(token){
           
              const fetchuser=async()=>{
                  try {
                      const response = await axiosInstance.get(GET_ROUTES.USER_PROFILE);
                      if(response.data.success ===true){
                        setUser(response.data.user)
                      }
                  } catch (error) {
                    console.log(error); 
                  }
              }
              fetchuser()
          }
      },[token,setUser]);

      
      const logoutSessionExpired =async()=>{
        const response = await axiosInstance.get(GET_ROUTES.LOGOUT)
        if( response.data.success===true){
          navigate(PATHS_URL.SIGNIN)
          setToken("")
          setUser("")
          sessionStorage.clear()
          toast.error('Session has expired. Please log in again.')
        }
      }

      const loginAction = async (userName,password) => {
        try {
          const response = await axiosInstance.post(POST_ROUTES.SIGN_IN,{userName,password})
          console.log(response);
          
          if(response.data.success === true){
            setToken(response.data.accessToken)
            sessionStorage.setItem('token', response.data.accessToken)
            localStorage.removeItem('userName')
            localStorage.removeItem('password')
            toast.success('Successfully Sign in ')
            navigate(PATHS_URL.PROFILE)
          }
          
        } catch (error) {
          setToken(null)
          console.log(error.response);
          toast.error(error.response.data.error)
        }
      };


      
      const logOut =async() => {
        const response = await axiosInstance.get(GET_ROUTES.LOGOUT)
        if( response.data.success===true){
          navigate(PATHS_URL.SIGNIN)
          setToken("")
          setUser("")
          sessionStorage.clear()
          toast.success('Log Out Successfully')
        }
      };

      const updateUser = (updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
      };

      return (
          <AuthContext.Provider value={{ token, user, logOut , loginAction}}>
            {children}
          </AuthContext.Provider>
      );
};

export default AuthProvider;


export const useAuth = () => {
  return useContext(AuthContext);
};



