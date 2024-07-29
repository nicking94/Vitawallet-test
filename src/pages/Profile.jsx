import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const Profile = () => {
  const { user, token, client, uid, expiry, signOut } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "https://api.qa.vitawallet.io/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "app-name": "ANGIE",
            "access-token": token,
            uid: uid,
            expiry: expiry,
            client: client,
          },
        },
      );
      setUserProfile(user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, client, uid, expiry]);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };
  const handleHomeRedirect = () => {
    navigate("/home");
  };
  const handleExchangeRedirect = () => {
    navigate("/exchange");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-[100vh] bg-[#F2F2F2]">
      <header>
        <nav className="flex h-[15vh] items-center justify-between border-b-[.1rem] border-gris px-4 py-2 text-white md:px-10">
          <p
            onClick={handleHomeRedirect}
            className="cursor-pointer text-lg font-lg text-azul"
          >
            Vita Wallet
          </p>
          <div className="hidden items-center space-x-8 md:flex">
            <p
              onClick={handleHomeRedirect}
              className="cursor-pointer text-sm font-sm text-azul"
            >
              Inicio
            </p>
            <p
              onClick={handleExchangeRedirect}
              className="cursor-pointer text-sm font-sm text-azul"
            >
              Intercambios
            </p>
            <p className="cursor-pointer py-2 text-sm font-sm text-azul">
              Perfil
            </p>
            <button
              onClick={handleSignOut}
              className="text-sm font-sm text-azul"
            >
              Cerrar Sesión
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-azul">
              &#9776;
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="flex flex-col items-center bg-[#F2F2F2] text-azul md:hidden">
            <div className="flex flex-col items-center p-2">
              <p className="text-sm font-sm text-gris">
                Bienvenido, {user?.first_name}
              </p>
            </div>
            <p
              onClick={handleHomeRedirect}
              className="cursor-pointer py-2 text-sm font-sm text-azul"
            >
              Inicio
            </p>
            <p
              onClick={handleExchangeRedirect}
              className="cursor-pointer py-2 text-sm font-sm text-azul"
            >
              Intercambios
            </p>
            <p className="cursor-pointer py-2 text-sm font-sm text-azul">
              Perfil
            </p>
            <button
              onClick={handleSignOut}
              className="py-2 text-sm font-sm text-azul"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </header>
      <div className="space-y-8 p-4 md:p-10">
        {userProfile ? (
          <div className="space-y-4">
            <h2 className="text-md font-sm text-azul">INFORMACIÓN DE PERFIL</h2>

            <p className="text-sm text-gris">
              Nombre: {user.first_name + " " + user.last_name}
              <br />
              Email: {user.email}
              <br />
              Dirección: {user.address}
              <br />
              Estado de la cuenta:{" "}
              <span className="text-green-600">
                {user.profile_verification}
              </span>
              <br />
              País: {user.login_current.country}
              <br />
              Ciudad: {user.login_current.city}
            </p>
          </div>
        ) : (
          <p>Cargando perfil...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
