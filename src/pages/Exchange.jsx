import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const Exchange = () => {
  const { user, token, client, uid, expiry, signOut } = useContext(AuthContext);
  const [prices, setPrices] = useState({});
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [validUntil, setValidUntil] = useState(null);
  const navigate = useNavigate();

  const fetchPrices = async () => {
    try {
      const response = await axios.get(
        "https://api.qa.vitawallet.io/api/users/get_crypto_multi_prices",
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
      setPrices(response.data.prices);
      setValidUntil(response.data.valid_until);
      setLoading(false);
      console.log(response.data);
    } catch (err) {
      setError("Error al obtener precios.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPrices();

      const updatePrices = () => {
        fetchPrices();
      };

      const calculateUpdateInterval = () => {
        const now = new Date();
        const validUntilDate = new Date(validUntil);
        const timeUntilValid = validUntilDate - now;

        if (timeUntilValid > 0) {
          const timeoutId = setTimeout(() => {
            updatePrices();
            calculateUpdateInterval();
          }, timeUntilValid);

          return timeoutId;
        } else {
          updatePrices();
          return null;
        }
      };

      const timeoutId = calculateUpdateInterval();

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [token, validUntil, client, uid, expiry]);

  const handleExchange = async () => {
    if (!fromCurrency || !toCurrency || !amount) {
      setError("Todos los campos son requeridos.");
      return;
    }

    try {
      await axios.post(
        "https://api.qa.vitawallet.io/api/transactions/exchange",
        {
          currency_sent: fromCurrency,
          currency_received: toCurrency,
          amount_sent: parseFloat(amount),
        },
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
      alert("¡Intercambio realizado con éxito!");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };
  const handleHomeRedirect = () => {
    navigate("/home");
  };
  const handleProfileRedirect = () => {
    navigate("/profile");
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
            className="cursor-pointer text-sm font-lg text-azul md:text-lg"
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
            <p className="cursor-pointer text-sm font-sm text-azul">
              Intercambios
            </p>
            <p
              onClick={handleProfileRedirect}
              className="cursor-pointer text-sm font-sm text-azul"
            >
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
            <p className="cursor-pointer py-2 text-sm font-sm text-azul">
              Intercambios
            </p>
            <p
              onClick={handleProfileRedirect}
              className="cursor-pointer py-2 text-sm font-sm text-azul"
            >
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
        <div className="flex flex-col items-center rounded-md bg-white px-4 md:p-10">
          <h3 className="w-full border-b-[.1rem] border-gris text-center text-md font-sm text-azul md:text-lg">
            Intercambios
          </h3>
          <div className="flex flex-col space-y-10 p-4 md:flex-row md:space-x-8 md:space-y-0 md:p-10">
            <select
              className="outline-none"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="">Selecciona moneda a intercambiar</option>
              {Object.keys(prices).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <select
              className="outline-none"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="">Selecciona moneda a obtener</option>
              {Object.keys(prices).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <input
              className="border-[.1rem] border-gris p-2 outline-none"
              type="number"
              placeholder="Cantidad"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="any"
            />

            {error && <p className="text-red-500">{error}</p>}
          </div>
          <button
            className="w-full bg-gris/50 p-2 text-sm text-white md:w-[30rem]"
            onClick={handleExchange}
          >
            Intercambiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exchange;
