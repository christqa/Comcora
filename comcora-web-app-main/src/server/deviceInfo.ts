import UAParser from "ua-parser-js";

export const buildDeviceInfo = (headers: Headers) => {
  const parser = new UAParser(headers.get("user-agent") ?? "");
  const os = parser.getOS();
  const { type } = parser.getDevice();
  return [
    ["device", os.name + " " + os.version],
    ["type", type ?? "desktop"],
  ]
    .map(([key, value]) => key + "=" + value)
    .join(";");
};
