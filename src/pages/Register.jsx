import { useState } from "react";
import { createUserWithEmailAndPassword,
  sendEmailVerification,
 } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";

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
    const regex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;    ;
    return regex.test(pwd);
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validarPassword(password)) {
      Swal.fire("Contraseña débil", "Debe tener al menos 6 caracteres, incluyendo letras y números", "warning");
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
        verificado: false
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
    <div className="container mt-5">
      <h2>Registro de Cliente</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <small className="form-text text-muted">
            Mínimo 6 caracteres, debe incluir letras, números y simbolos.
          </small>
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="comuna">Selecciona tu Comuna de la Región de Coquimbo</label>
          <div>
          <select id="comuna">
            <option value="1">Andacollo</option>
            <option value="2">Coquimbo</option>
            <option value="3">La Serena</option>
            <option value="4">La Higuera</option>
            <option value="5">Paihuano</option>
            <option value="6">Vicuña</option>
            <option value="7">Combarbalá</option>
            <option value="8">Monte Patria</option>
            <option value="9">Ovalle</option>
            <option value="10">Punitaqui</option>
            <option value="11">Río Hurtado</option>
            <option value="12">Canela</option>
            <option value="13">Illapel</option>
            <option value="14">Los Vilos</option>
            <option value="15">Salamanca</option>
          </select>
          </div> 
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono (opcional)</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success">Registrar</button>
      </form>
    </div>
  );
}
