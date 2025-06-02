import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import CerrarSesion from "../components/CerrarSesion";
import "../index.css";

export default function Home() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const datos = await getUserData(user.uid);
        setUserData(datos);
      }
    };
    fetch();
  }, [user]);

  return (
    <div className="container">
      <div className="card text-center">
        <h2 className="mb-3">Bienvenido {userData?.nombre}</h2>
        <p className="mb-3">Tipo de usuario: {userData?.tipo}</p>
        <CerrarSesion />
      </div>
    </div>
  );
}
