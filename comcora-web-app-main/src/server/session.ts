import * as process from "process";
import { type JwtTokenDTO } from "@xdatagroup/tbb-sdk/dist/api/services/auth/models";
import nextAppSession from "next-app-session";

export type UserSession = {
  accessToken: JwtTokenDTO;
  refreshToken: JwtTokenDTO;
  counter?: number;
  browserIdentifier: string;
};

export const session = nextAppSession<UserSession>({
  name: "TBB_SID",
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: false,
  },
});
