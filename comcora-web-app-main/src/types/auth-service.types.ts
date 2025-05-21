export type TokenRotateResponse = {
  token: string;
  status: "ROTATE" | "EXPIRED";
};

export type Device = {
  info: string;
  ip: string;
  geo: string;
};
export type TokenSessionResponse = {
  sessionId: string;
  issuedAt: string;
  device: Device;
  current: boolean;
};
