import { useEffect, useRef, useState } from "react";

export default function NavBar() {
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                // always show near the top
                setVisible(true);
            } else if (currentScrollY > lastScrollY.current) {
                // scrolling down
                setVisible(false);
            } else {
                // scrolling up
                setVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800 flex items-center justify-between py-4 px-8 md:px-22 transition-transform duration-300 ${
                visible ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <div className="flex items-center gap-8">
                <h2 className="text-xl font-bold text-white tracking-tight">
                    Syncvas
                </h2>
                <a
                    href=""
                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                    My boards
                </a>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-medium">
                    T
                </div>
                <span className="text-sm font-medium text-gray-300">
                    Thejas
                </span>
            </div>
        </div>
    );
}