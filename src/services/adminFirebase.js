import { db, secondaryAuth } from "./firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const registrarAdmin = async ({ email, password, nombre }) => {
  if (!password) throw new Error("La contraseña es requerida");

  const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);

  await setDoc(doc(db, "usuarios", cred.user.uid), {
    email,
    nombre,
    tipo: "admin",
  });

  await secondaryAuth.signOut();

  await sendEmailVerification(cred.user);
};

export const getAdministradores = async () => {
  const snap = await getDocs(collection(db, "usuarios"));
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((d) => d.tipo === "admin");
};

export const updateAdmin = async (id, data) => {
  await updateDoc(doc(db, "usuarios", id), data);
};

export const deleteAdmin = async (id) => {
  await deleteDoc(doc(db, "usuarios", id));
};
