import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const db = getFirestore();

export async function getCliente() {
  const uid = getAuth().currentUser.uid;
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  return { ...snap.data(), id: snap.id };
}

export async function updateCliente(data) {
  const uid = getAuth().currentUser.uid;
  const ref = doc(db, "usuarios", uid);
  await updateDoc(ref, data);
}
