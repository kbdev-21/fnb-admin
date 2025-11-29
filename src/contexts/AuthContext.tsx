import {
    createContext,
    useContext,
    type ReactNode,
    useState,
    useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { User } from "@/service/types.ts";

type AuthContextType = {
    token: string | null;
    myInfo: User | null;
    isReady: boolean;
    isLoggedIn: () => boolean;
    setTokenAndMyInfo: (newToken: string, newMyInfo: User) => void;
    clearTokenAndMyInfo: () => void;
};

type JwtPayload = {
    exp: number;
};

const STORAGE_KEYS = {
    TOKEN: "token",
    MY_INFO: "myInfo",
} as const;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [myInfo, setMyInfo] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedMyInfo = localStorage.getItem(STORAGE_KEYS.MY_INFO);

        if (storedToken && storedMyInfo) {
            try {
                setToken(storedToken);
                setMyInfo(JSON.parse(storedMyInfo));
            } catch (error) {
                console.error("Failed to parse stored user info:", error);
                localStorage.removeItem(STORAGE_KEYS.TOKEN);
                localStorage.removeItem(STORAGE_KEYS.MY_INFO);
            }
        }

        setIsReady(true);
    }, []);

    function isTokenExpired(): boolean {
        if (!token) return true;

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const now = Date.now() / 1000;
            return decoded.exp < now;
        } catch {
            return true;
        }
    }

    function isLoggedIn(): boolean {
        if (isTokenExpired()) return false;
        return token !== null && myInfo !== null;
    }

    function setTokenAndMyInfo(newToken: string, newMyInfo: User) {
        setToken(newToken);
        setMyInfo(newMyInfo);
        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
        localStorage.setItem(STORAGE_KEYS.MY_INFO, JSON.stringify(newMyInfo));
    }

    function clearTokenAndMyInfo() {
        setToken(null);
        setMyInfo(null);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.MY_INFO);
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                myInfo,
                isReady,
                isLoggedIn,
                setTokenAndMyInfo,
                clearTokenAndMyInfo,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Context must be used within a ContextProvider");
    }
    return context;
}
