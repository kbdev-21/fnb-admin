import {createContext, useContext, type ReactNode, useState, useEffect} from "react";

import {jwtDecode} from "jwt-decode";
import type {User} from "@/types/auth.ts";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [myInfo, setMyInfo] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedMyInfo = localStorage.getItem("myInfo");

    if(storedToken && storedMyInfo) {
      setToken(storedToken);
      setMyInfo(JSON.parse(storedMyInfo));
    }

    setIsReady(true);
  }, []);

  function isLoggedIn(): boolean {
    if(isTokenExpired()) return false;
    return !(!token && !myInfo);
  }

  function setTokenAndMyInfo(newToken: string, newMyInfo: User) {
    setToken(newToken);
    setMyInfo(newMyInfo);
    localStorage.setItem("token", newToken);
    localStorage.setItem("myInfo", JSON.stringify(newMyInfo));
  }

  function clearTokenAndMyInfo() {
    setToken(null);
    setMyInfo(null);
    localStorage.removeItem("token");
    localStorage.removeItem("myInfo");
  }

  function isTokenExpired(): boolean {
    if(!token) return true;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000
      return decoded.exp < now;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return true;
    }

  }

  return (
    <AuthContext.Provider value={{ token, myInfo, isReady, isLoggedIn, setTokenAndMyInfo, clearTokenAndMyInfo }}>
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