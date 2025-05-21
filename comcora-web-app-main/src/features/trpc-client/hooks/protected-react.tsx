"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/login/hooks/AuthContext";
import { type AppRouter } from "@/server/trpc/root";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";

const createQueryClient = (config?: QueryClientConfig) => {
  return new QueryClient(config);
};

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = (config?: QueryClientConfig) => {
  if (typeof window === "undefined") {
    return createQueryClient(config);
  }
  return (clientQueryClientSingleton ??= createQueryClient(config));
};

export const api = createTRPCReact<AppRouter>();

export function ProtectedTRPCReactProvider(props: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { encryptedAccessPin, destroy } = useAuth();
  const encryptedAccessPinRef = useRef(encryptedAccessPin);

  useEffect(() => {
    encryptedAccessPinRef.current = encryptedAccessPin;
  }, [encryptedAccessPin]);

  const queryClient = getQueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (error.message === "UNAUTHORIZED") {
          destroy();
          router.push("/");
        } else {
          console.error(`Something went wrong: ${error.message}`);
        }
      },
    }),
  });

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            headers.set("X-Encrypted-PIN", encryptedAccessPinRef.current);
            return headers;
          },
        }),

        /* TODO: investigate a way to submit a formData via TRPC
              splitLink({
                condition: (op) => {
                  return op.input instanceof FormData;
                },
                true: httpLink({
                  transformer: {
                    serialize: (object: unknown) => object,
                    deserialize: (object: unknown) => object,
                  },
                  url: getBaseUrl() + "/api/trpc",
                  headers: () => {
                    const headers = new Headers();
                    headers.set("x-trpc-source", "nextjs-react");
                    headers.set("X-Encrypted-PIN", encryptedAccessPinRef.current);
                    return headers;
                  },
                }),
                false: httpBatchLink({
                  transformer: SuperJSON,
                  url: getBaseUrl() + "/api/trpc",
                  headers: () => {
                    const headers = new Headers();
                    headers.set("x-trpc-source", "nextjs-react");
                    headers.set("X-Encrypted-PIN", encryptedAccessPinRef.current);
                    return headers;
                  },
                }),
              }),
           */
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_BASE_URL;
}
