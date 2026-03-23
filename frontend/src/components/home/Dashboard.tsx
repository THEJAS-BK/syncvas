import Hero from "./Hero";
import NavBar from "./NavBar";

export default function Dashboard() {
    return(
        <div className=" flex flex-col h-screen">
            <NavBar/>
            <Hero/>
        </div>
    )
};
