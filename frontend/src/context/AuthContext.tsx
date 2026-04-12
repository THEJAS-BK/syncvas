import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = (newToken) => {
    setToken(newToken);
  };
  const logOut=()=>{
    setToken(null);
  }
  return (
    <AuthContext.Provider value={{token,login,logOut}}>
        {children}
    </AuthContext.Provider>
  )
};
export const useAuth=()=>{
    return useContext(AuthContext)
}