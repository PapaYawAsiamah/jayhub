"use client";
import React, { useState } from "react";
import styles from "../page.module.css";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginPhrase, setLoginPhrase] = useState(
    "password should be atleeast 6 characters"
  );
  const [processPhrase, setProcessPhrase] = useState("Sign Up");
  const [state, setState] = useState(false);
   
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async () => {
    setProcessPhrase("signing up...");
    try {
      const res = await createUserWithEmailAndPassword(email, password);

      console.log({ res });
      sessionStorage.setItem("user", true);
      setEmail("");
      setPassword("");
      setState(true);
    } catch (e) {
      setState(false);
      console.error(e);
      setProcessPhrase("Sign Up");
    }

    if (state === true) {
      router.push("/");

      setLoginPhrase("password should be atleeast 6 characters ");
      setProcessPhrase("Sign Up");
    } else if (password.length < 6) {
      setLoginPhrase("please check password");
      router.push("./sign-up");
    } else {
      setLoginPhrase("user already exists");
      setState(false);
    }
  };

  return (
    <div>
      <div className={styles["auth-container"]}>
        <div className={styles["auth-card"]}>
          <h1 className={styles["auth-title"]}>Sign Up</h1>
          <p className={styles["auth-SUphrase"]}>{loginPhrase}</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["auth-input"]}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles["auth-input"]}
          />
          <button onClick={handleSignUp} className={styles["auth-button"]}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
