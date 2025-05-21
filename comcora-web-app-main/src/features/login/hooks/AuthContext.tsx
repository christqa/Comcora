"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { useRouter } from "next/navigation";
import { ProtectedTRPCReactProvider } from "@/features/trpc-client/hooks/protected-react";

export interface AuthContextMethods {
  encryptedAccessPin: string;
  destroy: () => void;
}
export const AuthContext = createContext<AuthContextMethods>({
  encryptedAccessPin: "",
  destroy: () => void 0,
});

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [encryptedAccessPin, setEncryptedPin] = useState("");
  const router = useRouter();

  useEffect(() => {
    const pin = sessionStorage.getItem("encryptedAccessPin");
    if (!pin) {
      const accessPinEncryptionNonce = localStorage.getItem(
        "accessPinEncryptionNonce"
      );
      if (accessPinEncryptionNonce) {
        router.replace("/pin-lock");
      } else {
        router.replace("/pin-setup");
      }
    } else {
      console.log("setEncryptedPin", pin);
      setEncryptedPin(pin);
    }
  }, []);

  const destroy = useCallback(() => {
    localStorage.removeItem("accessPinEncryptionNonce");
    localStorage.removeItem("resetPinEncryptionNonce");
    sessionStorage.removeItem("encryptedAccessPin");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        encryptedAccessPin: encryptedAccessPin,
        destroy,
      }}
    >
      <ProtectedTRPCReactProvider>{children}</ProtectedTRPCReactProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
