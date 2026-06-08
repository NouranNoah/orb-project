import SelectedUser from "./SelectedUser";
import LanguageSelector from "@/app/[locale]/i18n/LanguageSelector";

export default function SignupPage() {
  return (
    <div style={{position:"relative" }}>
      <LanguageSelector />
      <SelectedUser />
    </div>
  );
}
