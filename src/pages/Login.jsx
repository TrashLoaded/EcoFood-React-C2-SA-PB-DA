import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { getUserData } from '../services/userService';
import "../styles/FormPages.css";

export default function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      
      if (!cred.user.emailVerified) {
        Swal.fire("Verificación requerida", "Debes verificar tu correo antes de ingresar.", "warning");
        return;
      }
      
      const datos = await getUserData(cred.user.uid);
<<<<<<< HEAD
      if (datos.tipo === "admin") navigate("/admin/dashboard");
      else if (datos.tipo === "cliente") navigate("/cliente/dashboard");

    } catch (error) {
      console.error("Error en login:", error);
      Swal.fire(
        "Acceso denegado",
        "Usuario o contraseña incorrectos. Si ya te registraste, revisa tu correo y confirma tu cuenta.",
        "error"
      );
    }
  };
=======
      
      if (datos.tipo === "admin") navigate("/admin/dashboard");
      
      else if (datos.tipo === "cliente") navigate("/cliente/dashboard");
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        Swal.fire("Error", "Credenciales incorrectas", "error");
      }
    };
>>>>>>> 710f25fde4e17dbdb3b7e18c7e2a86b38a7797e2

  return (
    <div className="container login-container">
      <h2 className="text-center">Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        
        <div className="input-container">
          <label className="form-label">Correo electrónico</label>
          <div className="input-wrapper">
            <input
              type="email"
              className="form-control"
              value={email}  
              onChange={(e) => setEmail(e.target.value)}  
              required
              minLength={5}
              maxLength={100}
            />
          </div>
        </div>

        <div className="input-container">
          <label className="form-label">Contraseña</label>
          <div className="input-wrapper">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={32}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Iniciar Sesión
        </button>

        <div className="mt-3 text-center">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => navigate("/recuperar")}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className="mt-2 text-center">
          <span>¿No tienes cuenta? </span>
          <button
            type="button"
            className="btn btn-link p-0 align-baseline"
            onClick={() => navigate("/registro")}
          >
            Regístrate
          </button>
        </div>
      </form>
    </div>
  );
}
