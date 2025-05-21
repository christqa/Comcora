"use client";

import {
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

interface RegistrationContextValues {
  progress: boolean;
  loading: boolean;
  error: null | ErrorObject;
  success: boolean;
  setSuccess: (value: boolean) => void;
  initProgress: () => void;
  displayError: (value: ErrorObject) => void;
  completeProgress: () => void;
  dismissError: () => void;
}

export const RegistrationContext = createContext<RegistrationContextValues>({
  progress: false,
  loading: false,
  error: null,
  success: false,
  setSuccess: () => void 0,
  initProgress: () => void 0,
  displayError: () => void 0,
  completeProgress: () => void 0,
  dismissError: () => void 0,
});

const RegistrationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<ErrorObject | null>(null);

  const initProgress = () => {
    setProgress(true);
    setLoading(true);
    setError(null);
  };

  const displayError = (value: ErrorObject) => {
    setError(value);
    setLoading(false);
  };

  const completeProgress = () => {
    setProgress(false);
    setLoading(false);
    setError(null);
  };

  const dismissError = () => {
    setProgress(false);
    setError(null);
  };

  return (
    <RegistrationContext.Provider
      value={{
        progress,
        loading,
        error,
        success,
        setSuccess,
        initProgress,
        displayError,
        completeProgress,
        dismissError,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const {
    progress,
    loading,
    error,
    success,
    setSuccess,
    initProgress,
    displayError,
    completeProgress,
    dismissError,
  } = useContext(RegistrationContext);

  return {
    progress,
    loading,
    error,
    success,
    setSuccess,
    initProgress,
    displayError,
    completeProgress,
    dismissError,
  };
};

export default RegistrationProvider;
