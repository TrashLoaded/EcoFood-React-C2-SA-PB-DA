import { db, secondaryAuth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  setDoc,
  doc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const addEmpresa = async (empresaData) => {
  const { email, password, ...resto } = empresaData;

  if (!password) throw new Error("La contraseña es requerida");

  const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);

  await setDoc(doc(db, "usuarios", cred.user.uid), {
    ...resto,
    email,
    tipo: "empresa",
  });

  await secondaryAuth.signOut(); 
};

export const getEmpresas = async () => {
  const snap = await getDocs(collection(db, "usuarios"));
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((d) => d.tipo === "empresa");
};

export const updateEmpresa = async (id, data) => {
  await updateDoc(doc(db, "usuarios", id), data);
};

export const deleteEmpresa = async (id) => {
  await deleteDoc(doc(db, "usuarios", id));
};
