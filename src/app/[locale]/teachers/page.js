import styles from "./Teacher.module.css"
import Cookies from "js-cookie";

export default function TeacherHomePage() {
    const name = Cookies.get("nameUser")
return (
    <div>
        <h1>Hello in home teacher {name}</h1>
    </div>
);}
