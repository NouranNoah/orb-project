import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";


export default function Home() {
  return (
    <div className={styles.page}>
      <main style={{ padding: "40px", textAlign: "center" }}>
        <h1>Welcome to Our App 🚀</h1>
        <p>Manage your work easily and efficiently</p>

        <div style={{ marginTop: "20px" }}>
          <Link href="/ar/auth/login">
            <button>Login</button>
          </Link>

          <Link href="/ar/auth/signup" style={{ marginLeft: "10px" }}>
            <button>Sign Up</button>
          </Link>
        </div>
    </main>
    </div>
  );
}
