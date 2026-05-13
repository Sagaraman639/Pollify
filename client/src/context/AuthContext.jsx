import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  // CHECK USER
  useEffect(() => {

    const loadUser = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const res = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);

      } catch (error) {
        localStorage.removeItem("token");
      }

      setLoading(false);
    };

    loadUser();

  }, []);


  // REGISTER
  const register = async (formData) => {

    const res = await api.post(
      "/auth/register",
      formData
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    setUser(res.data);
  };


  // LOGIN
  const login = async (formData) => {

    const res = await api.post(
      "/auth/login",
      formData
    );

    localStorage.setItem(
      "token",
      res.data.token
    );

    setUser(res.data);
  };


  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);