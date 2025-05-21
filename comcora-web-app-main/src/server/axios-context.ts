import { buildDeviceInfo } from "@/server/deviceInfo";
import { type UserSession } from "@/server/session";
import { GATEWAY_API_HOST } from "@/server/trpc/config";
import { type JwtTokenDTO } from "@xdatagroup/tbb-sdk/dist/api/services/auth/models";
import axios, { type AxiosResponse } from "axios";
import { type AppSession } from "next-app-session";

// TODO For multi instance we need to store pending refresh token in db (redis)
const refreshTokenMap = new Map<string, Promise<string>>();
const VERBOSE = true;

export const buildAxiosContext = (
  accessToken: JwtTokenDTO | null,
  refreshToken: JwtTokenDTO | null,
  session: AppSession<UserSession>,
  headers: Headers
) => {
  const forwardedFor = headers.get("x-forwarded-for") ?? "";
  const clientIp = forwardedFor?.split(",")[0] ?? "Unknown";

  const newForwardedFor = forwardedFor
    ? forwardedFor.includes(clientIp)
      ? forwardedFor
      : `${clientIp}, ${forwardedFor}`
    : clientIp;

  const instance = axios.create({
    baseURL: GATEWAY_API_HOST,
    paramsSerializer(params) {
      return new URLSearchParams(params).toString();
    },
  });

  async function refreshAccessToken() {
    const token = refreshToken!.value;
    if (refreshTokenMap.has(token)) {
      return refreshTokenMap.get(token);
    }

    const refreshTokenPromise = (async () => {
      try {
        const response = await instance.post(
          GATEWAY_API_HOST + "/api/v1/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken!.value}`,
            },
          }
        );

        await session.set("accessToken", response.data.accessToken);
        await session.set("refreshToken", response.data.refreshToken);

        const newAccessToken = response.data.accessToken;

        return newAccessToken.value as string;
      } catch (error) {
        throw error;
      } finally {
        refreshTokenMap.delete(token);
      }
    })();

    refreshTokenMap.set(token, refreshTokenPromise);
    return refreshTokenPromise;
  }

  function convertToCurl({
    baseURL,
    method,
    url,
    headers,
    body,
    params,
  }: {
    baseURL: string;
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: Record<string, string> | string;
    params?: Record<string, string>;
  }): string {
    let curlCommand = `curl -X ${method.toUpperCase()} "${url.startsWith("http") ? url : `${baseURL}${url}`}"`;

    for (const [headerName, headerValue] of Object.entries(headers)) {
      curlCommand += ` \\\n    -H "${headerName}: ${headerValue}"`;
    }

    if (params) {
      const urlSearchParams = new URLSearchParams(params);
      curlCommand = curlCommand.replace(
        url,
        `${url}?${urlSearchParams.toString()}`
      );
    }

    if (
      body &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())
    ) {
      const bodyString = typeof body === "object" ? JSON.stringify(body) : body;
      curlCommand += ` \\\n    -d '${bodyString.replace(/'/g, "'\\''")}'`;
    }

    return curlCommand;
  }

  function logRequest(response: AxiosResponse): void {
    const request = {
      baseURL: response.config.baseURL!,
      method: response.config.method!,
      url: response.config.url!,
      headers: response.config.headers as Record<string, string>,
      body: response.config.data,
      params: response.config.params,
    };

    if (VERBOSE) {
      console.log("REQUEST:\n", convertToCurl(request));
      console.log(
        "RESPONSE ->",
        response?.data ||
          (response as unknown as { response: { data: object } }).response
            ?.data ||
          ""
      );
    }
  }

  instance.interceptors.request.use(
    (config) => {
      config.headers["Content-Type"] = "application/json";
      config.headers["X-Device-Info"] = buildDeviceInfo(headers);
      config.headers["x-forwarded-for"] = newForwardedFor;
      config.headers["X-Client-IP"] = clientIp;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  if (accessToken && refreshToken) {
    instance.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken.value}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => {
        return response; // Pass through the response if successful
      },
      async (error) => {
        const originalRequest = error.config;
        const isRefresh = (originalRequest as { url: string }).url.includes(
          "/api/v1/auth/refresh"
        );

        if (error.response.status === 401 && !isRefresh) {
          try {
            const newAccessToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  instance.interceptors.response.use(
    (response) => {
      logRequest(response);
      return response;
    },
    async (response) => {
      logRequest(response);
      return Promise.reject(response);
    }
  );

  return instance;
};
