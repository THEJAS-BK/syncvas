import Hero from "../components/home/Hero";
import NavBar from "../components/home/NavBar";

export default function Dashboard() {
    return(
        <div className=" flex flex-col h-screen">
            <NavBar/>
            <Hero/>
        </div>
    )
};
