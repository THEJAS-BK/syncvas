import {Route, Routes} from "react-router-dom";
import  Register  from "../components/auth/Register";
import Login from "../components/auth/Login";
import Dashboard from "../components/home/Dashboard";
import RoomPage from "../components/room/RoomPage";

export default function AllRoutes(){
    return(
       <Routes>
         <Route path="/register" element={<Register/>}/>
         <Route path="/" element={<Login/>}/>
         <Route path="/login" element={<Login/>}/>
         <Route path="/dashboard" element={<Dashboard/>}/>
         <Route path="/room" element={<RoomPage/>}/>
       </Routes>
    )
}