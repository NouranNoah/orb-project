import Header from "@/components/header/Header";
import styles from "./Student.module.css"
import Cookies from "js-cookie";

export default function StudentHomePage() {
    const name = Cookies.get("nameUser")
    
return (
    <div>
        <h1>Hello in home student {name}</h1>
        
    </div>
);}
