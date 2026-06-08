import Image from "next/image";
import Newpassword from "./Newpassword";
export default function NewPassPage() {

  return (
    <div className="AuthContent bgV">
        <Newpassword />
        <Image
        src="/images/newPassImg.png"
        alt="newPassImg"
        width={500}
        height={500}
        />
    </div>
  );
}
