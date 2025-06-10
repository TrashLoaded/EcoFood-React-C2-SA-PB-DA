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
import "../index.css";

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
        Swal.fire(
          "Verificación requerida",
          "Debes verificar tu correo antes de ingresar.",
          "warning"
        );
        return;
      }

      const datos = await getUserData(cred.user.uid);

      if (datos.tipo === "admin") navigate("/admin/dashboard");
      else if (datos.tipo === "cliente") navigate("/cliente/dashboard");
      else if (datos.tipo === "empresa") navigate("/empresa/perfil");
      else {
        Swal.fire("Error", "Tu rol no tiene una ruta asignada.", "error");
      }

    } catch (error) {
      console.error("Error en login:", error);
      Swal.fire(
        "Acceso denegado",
        "Usuario o contraseña incorrectos. Si ya te registraste, revisa tu correo y confirma tu cuenta.",
        "error"
      );
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-title">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <label className="form-label">Correo electrónico</label>
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

          <div className="input-container">
            <label className="form-label">Contraseña</label>
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

          <button type="submit" className="btn btn-success">
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
    </div>
  );
}
