import { useRouter } from "next/navigation";

export const useAuth = (props?: { isByPassword?: boolean }) => {
  const router = useRouter();
  const onLogin = () =>
    router.push(props?.isByPassword ? "/second-step" : "/pin-setup");
  return {
    onLogin,
  };
};
