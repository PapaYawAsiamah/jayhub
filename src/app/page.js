"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginPhrase, setLoginPhrase] = useState("");
  const [processPhrase, setProcessPhrase] = useState("Sign In");
  const userSession = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const [user] = useAuthState(auth);
  const [state, setState] = useState(false);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const [loginButtonDisable, setloginButtonDisable] = useState(false);
  const [openSignUpDisable, setAopenSignUpDisable] = useState(false);

  const handleSignIn = async () => {
    setProcessPhrase("signing in...");
    setloginButtonDisable(true);
     await signInWithEmailAndPassword(email, password)
     .then((res) => {
    //  console.log(res._tokenResponse.registered);
     if(res._tokenResponse.registered){
      router.push("/shop");
      setState(false);
      setLoginPhrase("");
      setProcessPhrase("Sign In");
      setloginButtonDisable(false);
      sessionStorage.setItem("user", true);
     }
     
      setEmail("");
      setPassword("");
      setState(true);
      setloginButtonDisable(false);
      
     }).catch((e) => {
      console.error(e);
      setProcessPhrase("Sign In");
      setloginButtonDisable(false);
      setLoginPhrase("please check credentials");
      setProcessPhrase("Sign In");
      setloginButtonDisable(false);
    })
  
     
    

    
  };
  
  return (
    <div>
      <div className={styles["auth-container"]}>
        <div className={styles["auth-card"]}>
          <h1 className={styles["auth-title"]}>Sign In</h1>
          <p className={styles["auth-phrase"]}>{loginPhrase}</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["auth-input"]}
            required
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles["auth-input"]}
          />
          <button
            disabled={loginButtonDisable}
            onClick={() => handleSignIn()}
            className={styles["auth-button"]}
          >
            {processPhrase}
          </button>
          <button
            disabled={openSignUpDisable}
            onClick={() => {
              router.push("./sign-up");
              setAopenSignUpDisable(false);
            }}
            className={styles["auth-SignUpbutton"]}
          >
            sign up
          </button>
        </div>
      </div>
    </div>
  );
          }
