"use client";
import Image from "next/image";
import { useState } from 'react';
import styles from "./page.module.css";
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginPhrase, setLoginPhrase] = useState('')
  const [processPhrase, setProcessPhrase] = useState('Sign In')
  const [state, setState] = useState(false)
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter()

  const handleSignIn = async () => {
    setProcessPhrase('signing in...')
    try {

        const res = await signInWithEmailAndPassword(email, password);
        console.log({res});
        sessionStorage.setItem('user', true)
        setEmail('');
        setPassword('');
        setState(true)

       
       
    }catch(e){
        console.error(e)
        setProcessPhrase('Sign In')
    }

  

    if(state === true){
      
      router.push('/shop')
      setState(false)
      setLoginPhrase('')
      setProcessPhrase('Sign In')
    }
    else{
      console.log('ee')
      setLoginPhrase('please check credentials')
      setProcessPhrase('Sign In')
    }
  };

 
 
  return (
    <div>
    <div className={styles['auth-container']}>
      <div className={styles['auth-card']}>
        <h1 className={styles['auth-title']}>Sign In</h1>
        <p className={styles['auth-phrase']}>{loginPhrase}</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles['auth-input']}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles['auth-input']}
        />
        <button onClick={handleSignIn} className={styles['auth-button']}>
         {processPhrase}
        </button>
        <button onClick={()=>{router.push('./sign-up')}} className={styles['auth-SignUpbutton']}>
         sign up
        </button>
       
      </div>
    </div>
    </div>
  );
}
