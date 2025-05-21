import { useCallback, useEffect, useRef } from "react";
import { useLogin } from "@/features/login/hooks/LoginContext";
import {
  type JwtTokenDTO,
  type MobileIdDTO,
  type SessionDTO,
  type SmartIdDTO,
} from "@xdatagroup/tbb-sdk/dist/api/services/auth/models";

type SkType = SmartIdDTO | MobileIdDTO;

type SkIdChallengeProps<T extends SkType> = {
  initiateRequest: () => Promise<SessionDTO>;
  onInitiateError: (error: Error) => void;
  statusRequest: (token: string) => Promise<SmartIdDTO | MobileIdDTO>;
  onCodeReceived: (code: string) => void;
  onComplete: () => void;
  onReject: (error: object) => void;
  onUnauthorised: () => void;
};

type LongPollingProps<T extends SkType> = Pick<
  SkIdChallengeProps<T>,
  "statusRequest" | "onUnauthorised" | "onReject" | "onComplete"
> & { sessionToken: JwtTokenDTO };

export type SkStatusResponse<T extends SkType> = Promise<
  { data: T } | { error: unknown }
> & {
  abort: () => void;
};

/* How long we wait before aborting the request */
const POLLING_TIMEOUT = 15000;
/* Delay before polling again */
const POLLING_INTERVAL = 500;
/* Initial retry delay */
const INITIAL_POLLING_RETRY = 1000;
const MAX_RETRIES = 1;

export const useSkLoginMethod = () => {
  const { challengeCode } = useLogin();
  const progressRef = useRef(Boolean(challengeCode));
  const abortControllerRef = useRef<() => void>();

  useEffect(() => {
    progressRef.current = Boolean(challengeCode);
    if (!progressRef.current && abortControllerRef.current) {
      abortControllerRef.current();
    }
  }, [challengeCode]);

  const statusLongPolling = useCallback(
    <T extends SkType>({
      sessionToken,
      statusRequest,
      onReject,
      onComplete,
      onUnauthorised,
    }: LongPollingProps<T>) => {
      const timeout = POLLING_TIMEOUT;
      let pollingRetryTimeout = INITIAL_POLLING_RETRY;
      let retryCount = 0;

      const pollStatus = () => {
        console.log(new Date(), "statusLongPolling -> polling");

        const statusPromise = statusRequest(sessionToken.value);
        statusPromise
          .then((data) => {
            if (data.status === "OK" || data.status === "NOT_MID_CLIENT") {
              console.log("statusLongPolling -> complete");
              onComplete();
            } else if (data.status === "RUNNING") {
              console.log("statusLongPolling -> running");
              setTimeout(pollStatus, POLLING_INTERVAL);
            } else {
              onReject({ message: "SK status not handled: " + data.status });
            }
          })
          .catch((error) => {
            if (retryCount < MAX_RETRIES) {
              console.log(
                "statusLongPolling -> error -> retrying in",
                pollingRetryTimeout
              );
              retryCount++;
              setTimeout(pollStatus, pollingRetryTimeout);
              pollingRetryTimeout *= 2;
            } else {
              console.log("statusLongPolling -> error -> max retries reached");
              onReject(error);
            }
          });
      };

      return pollStatus;
    },
    []
  );

  const initiateChallenge = useCallback(
    <T extends SkType>({
      initiateRequest,
      onInitiateError,
      onCodeReceived,
      onUnauthorised,
      statusRequest,
      onReject,
      onComplete,
    }: SkIdChallengeProps<T>) => {
      initiateRequest()
        .then((res) => {
          onCodeReceived(res.code);
          statusLongPolling({
            sessionToken: res.sessionToken,
            statusRequest,
            onUnauthorised,
            onReject,
            onComplete,
          })();
        })
        .catch((error) => {
          if (error.data.httpStatus === 401) {
            onUnauthorised();
          }
          onInitiateError(error);
        });
    },
    [statusLongPolling]
  );

  return {
    initiateChallenge,
  };
};
