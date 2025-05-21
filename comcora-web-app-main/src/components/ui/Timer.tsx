"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

export type TimerMethods = {
  time: string;
  active: boolean;
};
export const Timer = (props: {
  value: number;
  onComplete: () => void;
  children:
    | React.ReactNode
    | ((state: TimerMethods) => React.ReactNode)
    | undefined;
}) => {
  const { value, onComplete, children } = props;
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const [timer, setTimer] = useState(0); // Set initial timer value in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (value) {
      setTimer(value);
      setIsTimerRunning(true);
    } else {
      setTimer(0);
      setIsTimerRunning(false);
      clearInterval(timerRef.current);
    }
  }, [value]);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            setTimeout(onComplete, 0);
            return prevTimer;
          } else {
            return prevTimer - 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning]);

  const formattedTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (typeof children === "function") {
    return children({
      time: formattedTime(timer),
      active: isTimerRunning,
    });
  }
  return children;
};
