import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import CerrarSesion from "../components/CerrarSesion";
import "../styles/FormPages.css";

export default function Home() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const datos = await getUserData(user.uid);
      setUserData(datos);
    };
    if (user) fetch();
  }, [user]);

  return (
    <div className="container">
      <h2>Bienvenido {userData?.nombre}</h2>
      <p>Tipo de usuario: {userData?.tipo}</p>
      <CerrarSesion />
    </div>
  );
}
