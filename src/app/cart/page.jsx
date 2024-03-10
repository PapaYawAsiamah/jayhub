"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  where,
  doc,
  updateDoc,
  sum,
} from "firebase/firestore";
import Image from "next/image";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { addDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import Snackbar from "@mui/material/Snackbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { db } from "../firebase/config";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "../styles/cart.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextField from '@mui/material/TextField';

const page = () => {
  const router = usePathname();
  const userSession = sessionStorage.getItem("user");
  const [user] = useAuthState(auth);
  const [orders, setOrders] = useState([]);
  const [filtered, setFilterd] = useState([]);

  if (!user && !userSession) {
    router.push("/");
  }
  //getting data from firebase
  useEffect(() => {
    const reference = collection(db, "cart");

    const dbQuery = query(reference, orderBy("index", "asc"));

    onSnapshot(dbQuery, (querySnapshot) => {
      let i = 1;

      // Load data to Array
      setOrders(
        querySnapshot.docs.map((doc) => {
          let data = doc.data();

          return {
            id: doc.id,
            index: i++,
            ...data,
          };
        })
      );
    });
  }, []);
  useEffect(() => {
    if (user) {
      setFilterd(
        orders.filter((order) => order.userID === user.uid)
        //  setStudents(filtered)
      );
    }
  }, [orders]);

  // useEffect(() => {
  //   if (filtered.length === 0) {
  //     setGstate(true);
  //   } else if (filtered.length > 0) {
  //     setGstate(false);
  //   }
  // },[filtered])

  //pop up
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //deleting item
  const [seletedDocID, setseletedDocID] = useState(null);
  const [deleteState, setDeleteState] = useState("Yes");
  const confirmDelete = async () => {
    setDeleteState("removing");
    const docRef = doc(db, "cart", seletedDocID);
    await deleteDoc(docRef)
      .then((res) => {
        handleClose();
        setDeleteState("Yes");
        handleClick();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const deleteItem = (itemID) => {
    handleClickOpen();
    setseletedDocID(itemID);
    console.log(itemID);
  };

  //snackbar
  const [Snackopen, setSnackOpen] = React.useState(false);
  const [message, setMessage] = useState("item removed");
  const handleClick = () => {
    setSnackOpen(true);
  };
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  //const getting total
  const [total, setTotal] = useState()
  let totalSum = 0;
 let totalQuantity = 0;
  for (let i = 0; i < filtered.length; i++) {
    const { price, Quatity } = filtered[i];
    totalSum += price * Quatity;
  }
  for (let i = 0; i < filtered.length; i++) {
    const {  Quatity } = filtered[i];
    totalQuantity +=  Quatity;
  }

  //checking loading 
  // const [loading, setLoading] = useState(false)
  // if(filtered.length = 0){
  //   setLoading(true)
  // }
  // else{
  //   setLoading(false)
  // }

    //checking out
    const checkout =()=>{
      handleClickOpenFd()
    }


    //form dialog
    const [openFd, setOpenFd] = React.useState(false);

    const handleClickOpenFd = () => {
      setOpenFd(true);
    };
  
    const handleCloseFd = () => {
      setOpenFd(false);
    };
  

  
  return (
    <div className={styles.container}>
      <h1>Cart</h1>

      <div>
        
      {filtered.map((item) => (
        
          <div className={styles.cart} key={item.id}>
             
            <div className={styles.product}>
              <Image
                width="224"
                height="176"
                alt="product"
                src={item.image}
                priority
              ></Image>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{item.name}</h3>
                <h4 className={styles.productPrice}>GHC{item.price}</h4>
                <p className={styles.productQuantity}>
                  Quantity: {item.Quatity}
                </p>
                <p>
                  <span>Total: </span>
                  <span>{item.price * item.Quatity}</span>
                </p>
                <p
                  className={styles.productRemove}
                  onClick={() => deleteItem(item.id)}
                >
                  <DeleteIcon />
                </p>
              </div>
            </div>
           
            
          </div>
        ))}
       
          <div className={styles.cartTotal}>
            <p>
              <span>Total Price</span>
              <span>
                GHC{" "}
                {totalSum}
              </span>
            </p>
            <p>
              <span>Number of items</span>
              <span>GHC {totalQuantity}</span>
            </p>
            <button onClick={() => checkout()}>Checkout</button>
          </div>
       
      </div>

      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={"md"}
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">{"Quantity"}</DialogTitle>
          <DialogContent>
            {/* <DialogContentText id="alert-dialog-description">
           Are you sure you want to add this item to cart?
          </DialogContentText> */}
            Remove item?
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDelete}>{deleteState}</Button>
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
        message={message}
        color="success"
      />

<Dialog
        open={openFd}
        onClose={handleCloseFd }
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleCloseFd ();
          },
        }}
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{"Check Out"}</DialogTitle>
        <DialogContent>
        
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Name"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="phone"
            name="phone"
            label="WhatsApp number"
            type="number"
            fullWidth
            variant="standard"
          />
           <TextField
            autoFocus
            required
            margin="dense"
            id="hostel"
            name="hostel"
            label="Hostel"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFd}>Cancel</Button>
          <Button type="submit">Check Out</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default page;
