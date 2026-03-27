import UserContext from "../context/UserContext"
import { useContext } from "react"
import { Navigate } from "react-router-dom";

export default function Dashboard(){
    const {user, isLoggedIn} = useContext(UserContext)
    if(!isLoggedIn){
        return <Navigate to="/login" />
    }
    if(!user){
        return <p>loading...</p>
    }

    // if(user.role === 'admin'){
    //     return <Navigate to="/admin/approveVendors" />
    // }
    // if(user.role === 'vendor'){
    //     return <Navigate to="/vendor" />
    // }
    return (
        <div>
            <h2>Dashboard Component</h2>
            <h3>Welcome <b>{user.username}</b></h3>
            
        </div>
    )
}