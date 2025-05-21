"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = getQueryClient({
    defaultOptions: { queries: { retry: false } },
    queryCache: new QueryCache({
      onError: (error) => {
        if (error.message === "UNAUTHORIZED") {
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
            return headers;
          },
        }),
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
