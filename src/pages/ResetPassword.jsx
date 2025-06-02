import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire(
        "Correo enviado",
        "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        "success"
      );
    } catch (error) {
      Swal.fire(
        "Error",
        "No se pudo enviar el correo. Verifica que tu dirección sea válida.",
        "error"
      );
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-title">Recuperar contraseña</h2>
        <form onSubmit={handleReset}>
          <div className="input-container">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              minLength={5}
              maxLength={50}
              placeholder="ejemplo@correo.com"
            />
          </div>
          <button type="submit" className="btn btn-warning w-100">
            Enviar correo de recuperación
          </button>
          <div className="mt-3 text-center">
            <button
              type="button"
              className="btn btn-link"
              onClick={() => navigate("/login")}
            >
              Volver al login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
