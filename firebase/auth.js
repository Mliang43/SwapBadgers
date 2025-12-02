import { auth, db } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const signUp = async (email, password, name) => {
  if (!email.toLowerCase().endsWith("@wisc.edu")) {
    throw new Error("Please use a UW–Madison email.");
  }

  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    createdAt: serverTimestamp(),
  });

  return user;
};

export const logIn = async (email, password) => {
  if (!email.toLowerCase().endsWith("@wisc.edu")) {
    throw new Error("Only UW–Madison accounts are allowed.");
  }

  return signInWithEmailAndPassword(auth, email, password);
};
