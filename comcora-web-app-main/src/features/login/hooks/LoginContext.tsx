"use client";

import React, {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

export interface ErrorObject {
  message: string;
  description?: string;
  retry?: () => void;
}

export interface LoginContextMethods {
  progress: boolean;
  loading: boolean;
  challengeCode: null | string;
  error: null | ErrorObject;
  initProgress: () => void;
  displayChallengeCode: (value: string) => void;
  displayError: (value: ErrorObject) => void;
  completeProgress: () => void;
  dismissChallengeCode: () => void;
  dismissError: () => void;
}
export const LoginContext = createContext<LoginContextMethods>({
  progress: false,
  loading: false,
  challengeCode: null,
  error: null,
  initProgress: () => void 0,
  displayChallengeCode: () => void 0,
  displayError: () => void 0,
  completeProgress: () => void 0,
  dismissChallengeCode: () => void 0,
  dismissError: () => void 0,
});

const LoginProvider: FC<PropsWithChildren> = ({ children }) => {
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [challengeCode, setChallengeCode] = useState<string | null>(null);
  const [error, setError] = useState<ErrorObject | null>(null);

  const initProgress = () => {
    setProgress(true);
    setLoading(true);
    setChallengeCode(null);
    setError(null);
  };
  const displayChallengeCode = (value: string) => {
    setChallengeCode(value);
    setLoading(false);
  };

  const displayError = (value: ErrorObject) => {
    setError(value);
    setChallengeCode(null);
    setLoading(false);
  };

  const completeProgress = () => {
    setProgress(false);
    setLoading(false);
    setChallengeCode(null);
    setError(null);
  };

  const dismissChallengeCode = () => {
    setProgress(false);
    setChallengeCode(null);
  };

  const dismissError = () => {
    setProgress(false);
    setError(null);
  };

  return (
    <LoginContext.Provider
      value={{
        progress,
        loading,
        challengeCode,
        error,
        initProgress,
        displayChallengeCode,
        displayError,
        completeProgress,
        dismissChallengeCode,
        dismissError,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const {
    progress,
    loading,
    challengeCode,
    error,
    initProgress,
    displayChallengeCode,
    displayError,
    completeProgress,
    dismissChallengeCode,
    dismissError,
  } = useContext(LoginContext);

  return {
    progress,
    loading,
    challengeCode,
    error,
    initProgress,
    displayChallengeCode,
    displayError,
    completeProgress,
    dismissChallengeCode,
    dismissError,
  };
};

export default LoginProvider;
