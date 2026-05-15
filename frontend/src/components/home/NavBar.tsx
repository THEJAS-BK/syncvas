export default function NavBar() {
    return(
        <div className="bg-blue-400 flex justify-between py-3 px-22 ">
            <div className="flex justify-around gap-6 ">
                <h2 className="text-xl">CanavasCall</h2>
                <a href="">Dashboard</a>
                <a href="">Templates</a>
                <a href="">Rooms</a>
            </div>
            <div className="right">
                <button>Thejas</button>
            </div>
        </div>
    )
};
