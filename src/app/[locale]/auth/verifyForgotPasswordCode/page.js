import Image from "next/image";
import VerifyForgotPasswordCode from "./VerifyForgotPasswordCode";
export default function VerifyForgetPassPage() {

  return (
    <div className="verifycontent bgV">
        <div className="head">
            <VerifyForgotPasswordCode />
        </div>
        <Image
        src="/images/verifyAccountImg.png"
        alt="Verify Account Image"
        width={400}
        height={300}
        />
    </div>
  );
}
