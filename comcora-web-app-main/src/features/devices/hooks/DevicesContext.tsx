"use client";

import {
  createContext,
  useCallback,
  useContext,
  type PropsWithChildren,
} from "react";
import { useAuth } from "@/features/login/hooks/AuthContext";
import { api } from "@/features/trpc-client/hooks/react";
import { type TokenSessionResponse } from "@/types/auth-service.types";

type DevicesContextType = {
  data?: TokenSessionResponse[];
  sessionsFetched: boolean;
  endSession: (sessionId: string) => Promise<void>;
  endAllSessions: () => Promise<void>;
};

export const DevicesContext = createContext<DevicesContextType>({
  sessionsFetched: false,
  endSession: () => Promise.resolve(),
  endAllSessions: () => Promise.resolve(),
});

export const DevicesProvider = ({ children }: PropsWithChildren) => {
  const { encryptedAccessPin } = useAuth();
  const { data, isFetched: sessionsFetched } =
    api.sessions.listSessions.useQuery(undefined, {
      enabled: Boolean(encryptedAccessPin),
    });
  const { mutateAsync: endSessionMutation } =
    api.sessions.endSession.useMutation();
  const { mutateAsync: endAllSessionMutation } =
    api.sessions.endAllSessions.useMutation();

  const utils = api.useUtils();

  const endSession = useCallback(async (sessionId: string) => {
    return endSessionMutation({ sessionId: sessionId }).then((res) => {
      if ((res as { error: string }).hasOwnProperty("error")) {
        const { error } = res as { error: string };
        throw error;
      }
      return utils.sessions.invalidate();
    });
  }, []);

  const endAllSessions = useCallback(async () => {
    return endAllSessionMutation().then((res) => {
      if ((res as { error: string }).hasOwnProperty("error")) {
        const { error } = res as { error: unknown };
        throw error;
      }
      return utils.sessions.invalidate();
    });
  }, []);

  return (
    <DevicesContext.Provider
      value={{
        data,
        endSession,
        endAllSessions,
        sessionsFetched,
      }}
    >
      {children}
    </DevicesContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DevicesContext);
  if (!context) {
    throw new Error("useDevices must be used within a DevicesProvider");
  }
  return context;
};
