import React, { useEffect, useState } from 'react';
import '../../../public/css/dashbaord.css'
import { axiosInstance, GET_ROUTES, POST_ROUTES, PUT_ROUTES } from '../../constants';
import { toast } from 'react-toastify';
import { useAuth } from '../../utils/AuthContext';
import EditUserModal from './EditUserModal';

const DashBoard = () => {
    const [users, setUsers]= useState();
    const [isLoading,setIsLoading] =useState(false)
    const [showEditModel, setShowEditModel] = useState(false);
    const [selectedUser, setSelectedUser] = useState();

    const {user} = useAuth();

    const currentUser = user;
        
    useEffect(()=>{
        const fetchAllUsers = async()=>{
            try {
                setIsLoading(true)
                const response = await axiosInstance.get(GET_ROUTES.GET_ALL_USERS);
                setUsers(response.data.users)
                setIsLoading(false)
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllUsers()
    },[]);


    const closeModal = ()=>{
        setShowEditModel(false)
    }

    //HANDLE UPDATING BUTTON
    const handleUpdatingUser = async(updatedUserData)=>{
        const {userName,fullName,email,role}=updatedUserData
        
        const confirm = window.confirm(`Do you what update user ${selectedUser.userName}`);

        if(confirm){
            try {
                const response = await axiosInstance.put(PUT_ROUTES.EDIT_USER_DETAILS(selectedUser._id),{userName,fullName,email,role})
                
                if(response.data.success){
                    toast.success(`User ${selectedUser.userName} was successfully updated refresh the page`)
                    setShowEditModel(false)
                }
            } catch (error) {
                toast.error(error.response.data.error)
                console.log(error);
                
            }
        }
            
    }

    //HANDLE  ACTIVATION BUTTON
    const handleActivation =async(userId)=>{
        const confirm = window.confirm("Do you what to activate this user?")

        if(confirm){
            try {
                const response = await axiosInstance.post(POST_ROUTES.ACTIVATE_USER(userId))

                if(response.data.success){
                    toast.success('User Status activated successfully')
                }
            } catch (error) {
                toast.success(error.response.data.error) 
            }
        }   
    }

    //HANDLE  DEACTIVATION BUTTON
    const handleDeactivation =async(userId)=>{
        const confirm = window.confirm("Do you what to deactivate this user?")

        if(confirm){
            try {
                const response = await axiosInstance.post(POST_ROUTES.DEACTIVATE_USER(userId))

                if(response.data.success){
                    toast.success('User was deactivated successfully')
                }
            }catch (error) {
                    toast.success(error.response.data.error) 
                }
        }
    }

    //HANDLE  DELETE BUTTON
    const handleDelete =async(userId)=>{
        const confirm = window.confirm("Do you what to delete this user?")

        if(confirm){
            try {
                const response = await axiosInstance.post(POST_ROUTES.DELETE_USER(userId))

                if(response.data.success){
                        toast.success('User was delete successfully')
                }
            } catch (error) {
                toast.success(error.response.data.error) 
            }
        }
    }

    return (
        <>
            <div>
                {
                isLoading ? <h1>Loading....</h1>
                :(
                    <div>
                         { users && users.length>0 ?(
                            <table>
                                <thead>
                                    <tr>
                                        <th>User Name</th>
                                        <th>Fullname</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Role</th>
                                        <th>Actions</th> 
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((userDetails,index)=>(
                                        <tr key={index}>
                                            <td>{userDetails.userName}</td>
                                            <td>{userDetails.fullName}</td>
                                            <td>{userDetails.email}</td>
                                            <td>{userDetails.isActive ? "Active" : "Deactivated"}</td>
                                            <td>{userDetails.role}</td>
                                            <td>
                                                <button 
                                                    className={userDetails._id === currentUser._id ? "btn1 deactivate-btn" : "btn1 edit-btn"}
                                                    disabled={userDetails._id === currentUser._id}
                                                    onClick={()=>{
                                                        setSelectedUser(userDetails);
                                                        setShowEditModel(true) 
                                                    }}
                                                    >
                                                    Edit
                                                </button>
                                                <button
                                                    className={userDetails.isActive || userDetails._id === currentUser._id ? "btn1 deactivate-btn" : "btn1 activate-btn"}
                                                    disabled={userDetails.isActive || userDetails._id === currentUser._id}
                                                    onClick={()=>handleActivation(userDetails._id)}
                                                >
                                                    Activate
                                                </button>
                                                <button
                                                    className={userDetails.isActive && userDetails._id !== currentUser._id ? "btn1 activate-btn" : "btn1 deactivate-btn"}
                                                    disabled={!userDetails.isActive || userDetails._id === currentUser._id} 
                                                    onClick={()=>handleDeactivation(userDetails._id)}
                                                >
                                                    Deactivate
                                                </button>
                                                <button 
                                                    className={ userDetails._id === currentUser._id ? "btn1 deactivate-btn" : "btn1 delete-btn"}
                                                    disabled={userDetails._id === currentUser._id} 
                                                    onClick={()=>handleDelete(userDetails._id)}
                                                >   
                                                    Delete
                                                </button>
                                            </td>   
                                        </tr>
                                    ))}  
                                </tbody>
                            </table> 
                        ):(
                            <h1>No users</h1>
                        )
                        }
                        {showEditModel &&
                             <EditUserModal
                                closeModal ={closeModal}
                                userData = {selectedUser}
                                onSubmit ={handleUpdatingUser}
                             />
                        }
                       
                    </div> 
                )
                }
               
            </div>
        </>
    );
}

export default DashBoard;
