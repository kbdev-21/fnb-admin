import { Outlet } from "react-router-dom";
import WebNavbar from "./WebNavbar";

export default function WebLayout() {
    return (
        <div>
            <WebNavbar />
            <main
                className={"w-full max-w-screen-xl mx-auto flex flex-col px-4"}
            >
                <Outlet />
            </main>
        </div>
    );
}
