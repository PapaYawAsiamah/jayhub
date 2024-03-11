"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import styles from "../styles/shop.module.css";
// import { db } from "@/app/firebase/config";
import { db } from "../firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import Head from "next/head";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { addDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import Snackbar from "@mui/material/Snackbar";


const page = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const userSession = typeof window !== 'undefined' ? sessionStorage.getItem("user") : null;
  
  if (!user && !userSession) {
    router.push("/");
  }
  const [find, setFind] = useState("");
  const [order, setOrder] = useState([]);
 
  const [logoutPhrase, setLogoutPhrase] = useState("Log out") 
  const [cartPhrase, setCartPhrase] = useState("Open Cart") 

  const openCart = () => {
    setCartPhrase("opening")
    router.push("./cart")
   
  }

 

  const [Products, setProducts] = useState([]);
  const [filtered, setFilterd] = useState([]);
  const [resultState, setRstate] = useState(false);
  const [addState, setAddState] = useState("Add");

  //getting data from firebase
  useEffect(() => {
    const reference = collection(db, "products");

    const dbQuery = query(reference, orderBy("name", "asc"));

    onSnapshot(dbQuery, (querySnapshot) => {
      let i = 1;

      // Load data to Array
      setProducts(
        querySnapshot.docs.map((doc) => {
          let data = doc.data();

          return {
           
            index: i++,
            ...data,
          };
        })
      );
    });
  }, []);
  useEffect(() => {
    setFilterd(
      Products.filter((user) =>
        user.name.toLowerCase().includes(find.toLocaleLowerCase())
      )
      //  setStudents(filtered)
    );
    if (filtered.length === 0 && find) {
      setRstate(true);
    } else if (filtered.length > 0 && find.length === 0) {
      setRstate(false);
    }
  }, [Products, find]);

  //adding to cart

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const ConfirmAddtoCart = async () => {
    setAddState("Adding...");
    const OrderRef = collection(db, "cart");
    await addDoc(OrderRef, {
      ...order,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      userID: user.uid,
      Quatity: quatity
    })
      .then(() => {
        handleClose();
        setAddState("Yes");
        handleClick();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const AddtoCart = (docID) => {
    handleClickOpen();
    const index = Products.findIndex((product) => product.index === docID);
    setOrder(Products[index]);
  };

  //snackbar
  const [Snackopen, setSnackOpen] = React.useState(false);
  const handleClick = () => {
    setSnackOpen(true);
  };
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  //setting quatity
  const [quatity, setQuantity] = useState(1);
  const handleInputChange = (event) => {
    // Allow only non-negative numbers
    const inputValue = Math.max(0, parseInt(event.target.value, 10) || 1);
    setQuantity(inputValue);
  };

  return (
    <div>
      <Navbar find={find} setFind={setFind} />
      <div className={styles.banner}>
        <div className={styles.logout}>
          <button
            onClick={() => {
              setLogoutPhrase("logging out...")
              signOut(auth);
              sessionStorage.removeItem("user");
            }}
            className={styles["logout-button"]}
          >
           {logoutPhrase}
          </button>
          <button className={styles["Cart-button"]} onClick={() => {
            openCart()
          }}>{cartPhrase}</button>
        </div>
        <div className={styles.content}>
          <img
            src="/banner.jpg"
            alt="E-commerce Banner"
            className={styles.bannerImage}
          />
        </div>
      </div>

      {!resultState ? (
        <div className={styles.wrapper}>
          {filtered.map((product) => (
            <div className={styles.card} key={product.index}>
              <Image
                className={styles.cardimg}
                width="224"
                height="176"
                alt="product"
                src={product.image}
                priority
              ></Image>

              <div className={styles.cardbody}>
                <h1 className={styles.cardtitle}>{product.name}</h1>
           
                <h2 className={styles.cardPrice}>{product.price} GHC</h2>

                <div className={styles.contacts}>
                  <button
                    className={styles["Cart-button"]}
                    onClick={() => AddtoCart(product.index)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.result}>no results</p>
      )}
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Quantity"}</DialogTitle>
          <DialogContent>
            {/* <DialogContentText id="alert-dialog-description">
           Are you sure you want to add this item to cart?
          </DialogContentText> */}
            <input
              id="positiveNumberInput"
              type="number"
              value={quatity}
              onChange={handleInputChange}
              className={styles.numberInput}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={ConfirmAddtoCart}>{addState}</Button>
            <Button onClick={handleClose} autoFocus>
             Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      <Snackbar
        open={Snackopen}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message="Item Added"
        color="success"
      />
    </div>
  );
};

export default page;
