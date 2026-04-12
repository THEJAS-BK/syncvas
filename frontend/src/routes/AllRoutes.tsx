import {Route, Routes} from "react-router-dom";
import  Register  from "../components/auth/Register";
import Login from "../components/auth/Login";
import Dashboard from "../pages/Dashboard";
import RoomPage from "../pages/RoomPage";

export default function AllRoutes(){
    return(
       <Routes>
         <Route path="/register" element={<Register/>}/>
         <Route path="/" element={<Login/>}/>
         <Route path="/login" element={<Login/>}/>
         <Route path="/dashboard" element={<Dashboard/>}/>
         <Route path="/room/:roomId" element={<RoomPage/>}/>
       </Routes>
    )
}