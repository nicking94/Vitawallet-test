import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const Home = () => {
  const { user, token, client, uid, expiry, signOut } = useContext(AuthContext);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [visibleTransactions, setVisibleTransactions] = useState([]);
  const [hasMore, setHasMore] = useState(true);
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
      setBalance(response.data.data.attributes.balances);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "https://api.qa.vitawallet.io/api/transactions",
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
      const transactionsData = response.data.data;
      setTransactions(transactionsData);
      setVisibleTransactions(transactionsData.slice(0, 5));
      setHasMore(transactionsData.length > 5);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token && user?.email) {
      fetchProfile();
      fetchTransactions();
    }
  }, [token, user]);

  const handleExchangeRedirect = () => {
    navigate("/exchange");
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };
  const handleProfileRedirect = () => {
    navigate("/profile");
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLoadMore = () => {
    const nextVisibleTransactions = transactions.slice(
      visibleTransactions.length,
      visibleTransactions.length + 5,
    );
    setVisibleTransactions((prev) => [...prev, ...nextVisibleTransactions]);
    setHasMore(transactions.length > visibleTransactions.length + 5);
  };

  return (
    <div className="bg-[#F2F2F2]">
      <header>
        <nav className="flex h-[15vh] items-center justify-between border-b-[.1rem] border-gris px-4 py-2 text-white md:px-10">
          <p className="cursor-pointer text-lg font-lg text-azul">
            Vita Wallet
          </p>
          <div className="hidden items-center space-x-8 md:flex">
            <p className="cursor-pointer text-sm font-sm text-azul">Inicio</p>
            <p
              onClick={handleExchangeRedirect}
              className="cursor-pointer text-sm font-sm text-azul"
            >
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
              {menuOpen ? "✖" : "☰"}
            </button>
          </div>
        </nav>
        <div className="hidden flex-col items-center p-2 md:flex">
          <p className="text-sm font-sm text-gris">
            Bienvenido, {user?.first_name}
          </p>
        </div>
        {menuOpen && (
          <div className="flex flex-col items-center bg-[#F2F2F2] text-azul md:hidden">
            <div className="flex flex-col items-center p-2">
              <p className="text-sm font-sm text-gris">
                Bienvenido, {user?.first_name}
              </p>
            </div>
            <p className="cursor-pointer py-2 text-sm font-sm text-azul">
              Inicio
            </p>
            <p
              onClick={handleExchangeRedirect}
              className="cursor-pointer py-2 text-sm font-sm text-azul"
            >
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
        <div className="flex w-full flex-col rounded-md bg-white p-4 md:items-center md:p-10">
          <h3 className="w-full border-b-[.1rem] border-gris text-center text-lg font-sm text-azul">
            Balance
          </h3>

          {balance ? (
            <ul className="flex flex-col space-y-4 py-4 text-azul md:flex-row md:space-x-20 md:text-center">
              <li>
                <p className="flex items-center gap-x-1 text-sm font-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32"
                  >
                    <g fill="none">
                      <circle cx="16" cy="16" r="16" fill="#3e73c4" />
                      <g fill="#fff">
                        <path d="M20.022 18.124c0-2.124-1.28-2.852-3.84-3.156c-1.828-.243-2.193-.728-2.193-1.578c0-.85.61-1.396 1.828-1.396c1.097 0 1.707.364 2.011 1.275a.458.458 0 0 0 .427.303h.975a.416.416 0 0 0 .427-.425v-.06a3.04 3.04 0 0 0-2.743-2.489V9.142c0-.243-.183-.425-.487-.486h-.915c-.243 0-.426.182-.487.486v1.396c-1.829.242-2.986 1.456-2.986 2.974c0 2.002 1.218 2.791 3.778 3.095c1.707.303 2.255.668 2.255 1.639c0 .97-.853 1.638-2.011 1.638c-1.585 0-2.133-.667-2.316-1.578c-.06-.242-.244-.364-.427-.364h-1.036a.416.416 0 0 0-.426.425v.06c.243 1.518 1.219 2.61 3.23 2.914v1.457c0 .242.183.425.487.485h.915c.243 0 .426-.182.487-.485V21.34c1.829-.303 3.047-1.578 3.047-3.217z" />
                        <path d="M12.892 24.497c-4.754-1.7-7.192-6.98-5.424-11.653c.914-2.55 2.925-4.491 5.424-5.402c.244-.121.365-.303.365-.607v-.85c0-.242-.121-.424-.365-.485c-.061 0-.183 0-.244.06a10.895 10.895 0 0 0-7.13 13.717c1.096 3.4 3.717 6.01 7.13 7.102c.244.121.488 0 .548-.243c.061-.06.061-.122.061-.243v-.85c0-.182-.182-.424-.365-.546m6.46-18.936c-.244-.122-.488 0-.548.242c-.061.061-.061.122-.061.243v.85c0 .243.182.485.365.607c4.754 1.7 7.192 6.98 5.424 11.653c-.914 2.55-2.925 4.491-5.424 5.402c-.244.121-.365.303-.365.607v.85c0 .242.121.424.365.485c.061 0 .183 0 .244-.06a10.895 10.895 0 0 0 7.13-13.717c-1.096-3.46-3.778-6.07-7.13-7.162" />
                      </g>
                    </g>
                  </svg>
                  USD
                </p>

                <p className="text-sm text-gris">{balance.usd}</p>
              </li>
              <li>
                <p className="flex items-center gap-x-1 text-sm font-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32"
                  >
                    <g fill="none" fillRule="evenodd">
                      <circle cx="16" cy="16" r="16" fill="#f7931a" />
                      <path
                        fill="#fff"
                        fillRule="nonzero"
                        d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84l-1.728-.43l-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009l-2.384-.595l-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045l-1.13 4.532c-.086.212-.303.531-.793.41c.018.025-1.256-.313-1.256-.313l-.858 1.978l2.25.561c.418.105.828.215 1.231.318l-.715 2.872l1.727.43l.708-2.84c.472.127.93.245 1.378.357l-.706 2.828l1.728.43l.715-2.866c2.948.558 5.164.333 6.097-2.333c.752-2.146-.037-3.385-1.588-4.192c1.13-.26 1.98-1.003 2.207-2.538m-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11m.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733"
                      />
                    </g>
                  </svg>{" "}
                  BTC
                </p>
                <p className="text-sm text-gris">{balance.btc}</p>
              </li>
              <li>
                <p className="flex items-center gap-x-1 text-sm font-sm">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32"
                  >
                    <g fill="none">
                      <circle cx="16" cy="16" r="16" fill="#3e73c4" />
                      <g fill="#fff">
                        <path d="M20.022 18.124c0-2.124-1.28-2.852-3.84-3.156c-1.828-.243-2.193-.728-2.193-1.578c0-.85.61-1.396 1.828-1.396c1.097 0 1.707.364 2.011 1.275a.458.458 0 0 0 .427.303h.975a.416.416 0 0 0 .427-.425v-.06a3.04 3.04 0 0 0-2.743-2.489V9.142c0-.243-.183-.425-.487-.486h-.915c-.243 0-.426.182-.487.486v1.396c-1.829.242-2.986 1.456-2.986 2.974c0 2.002 1.218 2.791 3.778 3.095c1.707.303 2.255.668 2.255 1.639c0 .97-.853 1.638-2.011 1.638c-1.585 0-2.133-.667-2.316-1.578c-.06-.242-.244-.364-.427-.364h-1.036a.416.416 0 0 0-.426.425v.06c.243 1.518 1.219 2.61 3.23 2.914v1.457c0 .242.183.425.487.485h.915c.243 0 .426-.182.487-.485V21.34c1.829-.303 3.047-1.578 3.047-3.217z" />
                        <path d="M12.892 24.497c-4.754-1.7-7.192-6.98-5.424-11.653c.914-2.55 2.925-4.491 5.424-5.402c.244-.121.365-.303.365-.607v-.85c0-.242-.121-.424-.365-.485c-.061 0-.183 0-.244.06a10.895 10.895 0 0 0-7.13 13.717c1.096 3.4 3.717 6.01 7.13 7.102c.244.121.488 0 .548-.243c.061-.06.061-.122.061-.243v-.85c0-.182-.182-.424-.365-.546m6.46-18.936c-.244-.122-.488 0-.548.242c-.061.061-.061.122-.061.243v.85c0 .243.182.485.365.607c4.754 1.7 7.192 6.98 5.424 11.653c-.914 2.55-2.925 4.491-5.424 5.402c-.244.121-.365.303-.365.607v.85c0 .242.121.424.365.485c.061 0 .183 0 .244-.06a10.895 10.895 0 0 0 7.13-13.717c-1.096-3.46-3.778-6.07-7.13-7.162" />
                      </g>
                    </g>
                  </svg>
                  USDC
                </p>
                <p className="text-sm text-gris">{balance.usdc}</p>
              </li>
              <li>
                <p className="flex items-center gap-x-1 text-sm font-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 32 32"
                  >
                    <g fill="none" fillRule="evenodd">
                      <circle cx="16" cy="16" r="16" fill="#26a17b" />
                      <path
                        fill="#fff"
                        d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042c-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658c0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061c1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658c0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118c0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116c0-1.043-3.301-1.914-7.694-2.117"
                      />
                    </g>
                  </svg>{" "}
                  USDT
                </p>
                <p className="text-sm text-gris">{balance.usdt}</p>
              </li>
            </ul>
          ) : (
            "Cargando..."
          )}

          <button
            type="submit"
            className="w-full bg-gris/50 p-2 text-sm text-white md:w-[30rem]"
            onClick={handleExchangeRedirect}
          >
            Realizar Intercambios
          </button>
        </div>

        <div className="rounded-md bg-white p-10">
          <h3 className="w-full border-b-[.1rem] border-gris text-center text-lg font-sm text-azul">
            Transacciones
          </h3>
          {visibleTransactions.length > 0 ? (
            <ul className="space-y-4 py-4 text-gris">
              {visibleTransactions.map((transaction) => (
                <li key={transaction.id} className="text-md">
                  <p className="text-sm md:text-md">
                    Detalles de la transacción
                    <br />
                    <span className="text-sm text-azul">
                      {transaction.attributes.description}
                    </span>
                  </p>

                  <p className="text-sm text-gris">
                    <span className="text-azul">Monto de la transacción:</span>{" "}
                    {transaction.attributes.amount}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay transacciones disponibles.</p>
          )}
          {hasMore && (
            <div className="flex justify-center">
              <button
                className="w-[30rem] bg-gris/50 p-2 text-sm text-white"
                onClick={handleLoadMore}
              >
                Ver más
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
