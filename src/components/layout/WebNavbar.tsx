import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function WebNavbar() {
    const auth = useAuth();
    const navigate = useNavigate();

    const isLoggedIn = auth.isLoggedIn();

    return (
        <div className="w-full h-20 bg-background shadow-md">
            <div className="flex items-center h-full w-full max-w-screen-xl mx-auto px-4">
                <div className="flex w-[25%] items-center gap-2">
                    <Link to="/">
                        <img src="/icon.png" alt="logo" className="w-14 h-14" />
                    </Link>
                </div>
                <div className="flex w-[50%] justify-around text-md font-[700] tracking-wider px-[2vw]">
                    <Link to="/menu">MENU</Link>
                    <Link to="/find-a-store">FIND A STORE</Link>
                    <Link to="/contact-us">CONTACT US</Link>
                </div>
                <div className="w-[25%] flex justify-end gap-4 items-center">
                    {!isLoggedIn ? (
                        <>
                            <Button
                                variant="outline"
                                size={"lg"}
                                className="text-md font-[700] px-5 rounded-full border-foreground"
                                onClick={() => {
                                    navigate("/login");
                                }}
                            >
                                Sign in
                            </Button>
                            <Button
                                size={"lg"}
                                className="text-md font-[700] px-5 rounded-full"
                            >
                                Join us
                            </Button>
                        </>
                    ) : (
                        <ProfileBadge />
                    )}
                </div>
            </div>
        </div>
    );

    function ProfileBadge() {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-full transition-colors duration-200 ease-in-out hover:bg-accent/50 cursor-pointer">
                        <img
                            src="https://www.shutterstock.com/image-vector/portrait-cat-glasses-vector-art-600nw-2284410025.jpg"
                            alt="User avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-md font-[700]">
                            {auth.myInfo?.firstName}
                        </span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {auth.myInfo?.role === "ADMIN" && (
                        <DropdownMenuItem
                            onClick={() => window.open("/admin", "_blank")}
                        >
                            Admin dashboard
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            auth.clearTokenAndMyInfo();
                            navigate("/");
                        }}
                    >
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
}
