import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";
import "../styles/FormPages.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState("cliente");
  const navigate = useNavigate();

  const validarPassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    return regex.test(pwd);
  };

  const formatTelefono = (value) => {
    const cleaned = value.replace(/\D/g, ""); 
    const match = cleaned.match(/^569(\d{4})(\d{4})$/);
    if (match) {
      return `+56 9 ${match[1]} ${match[2]}`;
    }
    return cleaned.length <= 11 ? cleaned : cleaned.slice(0, 11);
  };

  const handleTelefonoChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, "");
    let fullNumber = cleaned;
    if (!cleaned.startsWith("56")) {
      if (cleaned.startsWith("9")) {
        fullNumber = "569" + cleaned.slice(1);
      } else {
        fullNumber = "569" + cleaned;
      }
    }
    setTelefono(formatTelefono(fullNumber));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validarPassword(password)) {
      Swal.fire(
        "Contraseña débil",
        "La contraseña debe tener al menos 6 caracteres, incluyendo mayúsculas, minúsculas, números y un símbolo.",
        "warning"
      );
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await saveUserData(cred.user.uid, {
        nombre,
        email,
        direccion,
        comuna,
        telefono,
        tipo,
        verificado: false,
      });

      await sendEmailVerification(cred.user);

      Swal.fire(
        "Registro exitoso",
        "Se ha enviado un correo de verificación. Verifica tu cuenta antes de iniciar sesión.",
        "success"
      );

      navigate("/login");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="container">
      <h2>Registro de Cliente</h2>
      <form onSubmit={handleRegister}>
        <div className="input-container">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            minLength={2}
            maxLength={50}
          />
        </div>
        <div className="input-container">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            minLength={5}
            maxLength={50}
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
            minLength={6}
            maxLength={20}
          />
          <small className="form-text text-muted">
            Mínimo 6 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.
          </small>
        </div>
        <div className="input-container">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
            minLength={5}
            maxLength={30}
          />
        </div>
        <div className="input-container">
          <label className="form-label">Comuna</label>
          <select
            className="form-select"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            required
          >
            <option value="">-- Selecciona una comuna --</option>
            <option value="Andacollo">Andacollo</option>
            <option value="Coquimbo">Coquimbo</option>
            <option value="La Serena">La Serena</option>
            <option value="La Higuera">La Higuera</option>
            <option value="Paihuano">Paihuano</option>
            <option value="Vicuña">Vicuña</option>
            <option value="Combarbalá">Combarbalá</option>
            <option value="Monte Patria">Monte Patria</option>
            <option value="Ovalle">Ovalle</option>
            <option value="Punitaqui">Punitaqui</option>
            <option value="Río Hurtado">Río Hurtado</option>
            <option value="Canela">Canela</option>
            <option value="Illapel">Illapel</option>
            <option value="Los Vilos">Los Vilos</option>
            <option value="Salamanca">Salamanca</option>
          </select>
        </div>
        <div className="input-container">
          <label className="form-label">Teléfono (opcional)</label>
          <input
            type="text"
            className="form-control"
            value={telefono}
            onChange={handleTelefonoChange}
            placeholder="+56 9 1234 5678"
          />
        </div>
        <button type="submit" className="btn btn-success">
          Registrar
        </button>
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/login")}
          >
            Volver al login
          </button>
        </div>
      </form>
    </div>
  );
}
