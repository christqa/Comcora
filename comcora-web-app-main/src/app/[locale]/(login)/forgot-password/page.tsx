import { AccountConfirmationCode } from "@/features/account/components/AccountConfirmationCode";
import GoToMain from "@/features/login/components/GoToMain";

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-[26.5rem] flex-col gap-y-8 rounded-5xl bg-fill-background-main p-8">
      <GoToMain />
      <AccountConfirmationCode />
    </div>
  );
}
