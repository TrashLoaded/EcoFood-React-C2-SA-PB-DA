import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
<<<<<<< HEAD
import { AuthContext } from "./AuthContext";
import { getUserData } from "../services/userService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser (firebaseUser);
=======
import { AuthContext } from "./AuthContext"; // Asegúrate de tener este archivo separado
import { getUserData } from "../services/userService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase Auth
  const [userData, setUserData] = useState(null); // Firestore: nombre, tipo, etc.
  const [loading, setLoading] = useState(true); // Carga completa
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
>>>>>>> 710f25fde4e17dbdb3b7e18c7e2a86b38a7797e2
        try {
          const data = await getUserData(firebaseUser.uid);
          setUserData(data);
        } catch (error) {
<<<<<<< HEAD
          setUserData(null);
        }
    } else {
      setUser(null);
      setUserData(null);
    }
      setLoading(null);
  });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
=======
          console.error("Error cargando datos de Firestore:", error);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  return (
  <AuthContext.Provider value={{ user, userData, loading }}>
  {children}
  </AuthContext.Provider>
>>>>>>> 710f25fde4e17dbdb3b7e18c7e2a86b38a7797e2
  );
};
