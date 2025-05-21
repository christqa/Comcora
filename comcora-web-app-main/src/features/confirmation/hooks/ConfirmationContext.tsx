"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { EmailConfirmationDialog } from "@/features/confirmation/components/EmailConfirmationDialog";
import { PhoneConfirmationDialog } from "@/features/confirmation/components/PhoneConfirmationDialog";

export interface ConfirmationInit {
  type: "email" | "phone" | "smart-id" | "mobile-id" | "id-card" | "app";
  destination?: string;
  challengeCode?: string;
}
export interface ConfirmationContextMethods {
  confirm: (data: ConfirmationInit) => Promise<{ success: boolean }>;
}
export const ConfirmationContext = createContext<ConfirmationContextMethods>({
  confirm: () => Promise.resolve({ success: false }),
});

const ConfirmationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [config, setConfig] = useState<ConfirmationInit | undefined>();
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState<boolean>(
    config?.type === "phone"
  );
  const request = useRef<(data: { success: boolean }) => void | undefined>();

  useEffect(() => {
    setIsPhoneDialogOpen(config?.type === "phone");
  }, [config]);

  const confirm = async (data: ConfirmationInit) => {
    if (request.current) {
      // prevent multiple confirmation at the same time
      return {
        success: false,
      };
    }
    return new Promise<{ success: boolean }>((resolve) => {
      request.current = resolve;
      setConfig(data);
    });
  };
  const handleSubmit = () => {
    // TODO: implement verification;
    setConfig(undefined);
    if (request.current) {
      request.current({ success: true });
      request.current = undefined;
    }
  };

  const handleDismissEmailVerification = () => {
    // TODO: check if possible to use a fallback solution
    setConfig((prevState) => {
      return {
        ...prevState,
        type: "email",
        destination: "test@gmail.com",
      };
    });
  };

  return (
    <ConfirmationContext.Provider
      value={{
        confirm,
      }}
    >
      {children}
      <>
        <EmailConfirmationDialog
          open={config?.type === "email"}
          email={"foo@bar.ru"}
          onSubmit={handleSubmit}
        />
        <PhoneConfirmationDialog
          open={isPhoneDialogOpen}
          onOpenChange={(v) => setIsPhoneDialogOpen(v)}
          onSubmit={handleSubmit}
          onDismiss={handleDismissEmailVerification}
        />
      </>
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => useContext(ConfirmationContext);

export default ConfirmationProvider;
