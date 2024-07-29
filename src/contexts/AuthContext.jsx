import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [client, setClient] = useState(null);
  const [uid, setUid] = useState(null);
  const [expiry, setExpiry] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedClient = localStorage.getItem("client");
    const storedUid = localStorage.getItem("uid");
    const storedExpiry = localStorage.getItem("expiry");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedToken && storedClient && storedUid && storedExpiry) {
      setToken(storedToken);
      setClient(storedClient);
      setUid(storedUid);
      setExpiry(storedExpiry);
      setUser(storedUser);
    }
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await axios.post(
        "https://api.qa.vitawallet.io/api/auth/sign_in",
        null,
        {
          headers: {
            "app-name": "ANGIE",
          },
          params: {
            email,
            password,
            dev_mode: true,
          },
        },
      );

      const userData = response.data.data.attributes;
      const token = response.headers["access-token"];
      const client = response.headers["client"];
      const uid = response.headers["uid"];
      const expiry = response.headers["expiry"];

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      localStorage.setItem("client", client);
      localStorage.setItem("uid", uid);
      localStorage.setItem("expiry", expiry);

      setUser(userData);
      setToken(token);
      setClient(client);
      setUid(uid);
      setExpiry(expiry);
    } catch (error) {
      console.error(
        "Error en el inicio de sesión:",
        error.response ? error.response.data : error.message,
      );
      throw new Error(
        error.response
          ? error.response.data.errors[0]
          : "Error en el inicio de sesión",
      );
    }
  };

  const signOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("client");
    localStorage.removeItem("uid");
    localStorage.removeItem("expiry");

    setUser(null);
    setToken(null);
    setClient(null);
    setUid(null);
    setExpiry(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, client, uid, expiry, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
