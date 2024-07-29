import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
    } catch (error) {
      setError("Email o contraseña incorrectos. Intente nuevamente.");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  return (
    <div className="overflow-hidden bg-[#F2F2F2]">
      <header>
        <nav className="flex h-[14vh] items-center justify-between border-b-[.1rem] border-gris px-4 md:px-10 py-2 text-white">
          <p className="text-sm font-lg text-azul md:text-lg">Vita Wallet</p>
          <p className="text-sm font-sm italic text-gris">Frontend Test</p>
        </nav>
        <hr />
      </header>
      <div className="flex h-[85vh] w-screen items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center space-y-5 rounded-md bg-white p-8 shadow-xl shadow-gris/20 md:h-[25rem] md:w-[40rem]"
        >
          <h2 className="font-md text-center text-md text-azul">
            Iniciar Sesión
          </h2>

          <input
            className="w-full rounded-sm border-[.1rem] border-slate-400 p-2 outline-none md:w-[30rem] "
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-sm border-[.1rem] border-slate-400 p-2 outline-none md:w-[30rem]"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="mt-8 w-full bg-gris/50 p-2 text-sm text-white md:w-[30rem] "
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
