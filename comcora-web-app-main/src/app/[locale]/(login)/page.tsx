import { LoginWidget } from "@/features/login/components/LoginWidget";
import LoginProvider from "@/features/login/hooks/LoginContext";

export default function LoginPage() {
  return (
    <LoginProvider>
      <div className="flex flex-col">
        <LoginWidget />
      </div>
    </LoginProvider>
  );
}
