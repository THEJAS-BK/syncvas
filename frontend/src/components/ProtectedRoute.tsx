import { Navigate } from "react-router-dom";
import { Children, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute=({children}:{children:ReactNode})=>{
    const {accessToken}=useAuth();

    if(!accessToken){
        return <Navigate to="/login" replace/> 
    }

    return <>{children}</>
}

export default ProtectedRoute;