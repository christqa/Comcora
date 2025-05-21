import { headers } from "next/headers";

export function getIPAddress() {
  const headersData = headers();
  console.log("getIPAddress", headersData);
  return (
    headersData.get("cf-connecting-ip") ?? headersData.get("x-forwarded-for")
  );
}
