"use client";
import styles from "../styles/navbar.module.css";
import Link from "next/link";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Image from "next/image";
import TelegramIcon from "@mui/icons-material/Telegram";
const Navbar = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/logo.png" width="70" height="70" alt="logo" />
        </Link>
      </div>
      <div className={styles.search}>
        <form>
          <input
            type="text"
            placeholder="search product"
            //   onChange={(e) => {
            //     context.setFind(e.target.value);
            //   }}
            //   value={context.find}
          />
          
        </form>
      </div>
      <div className={styles.icons}>
        <Link href="https://wa.me/+233209851044">
          <WhatsAppIcon />
        </Link>
        <Link href="https://t.snapchat.com/Ewki30kR">
          <Image src="/snap.avif" width="20" height="20" alt="snapchat" style={{backgroundColor:'rgb(70, 204, 70)'}}/>
        </Link>
        <Link href="https://t.me/thecampustore">
          <TelegramIcon />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
