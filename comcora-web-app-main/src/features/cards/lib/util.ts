import { format, fromUnixTime } from "date-fns";

export const formatCreditCardNumber = (creditCardNumber: string): string => {
  if (!creditCardNumber) {
    return "";
  }
  const parts = creditCardNumber.match(/.{1,4}/g);

  if (!parts) {
    return "";
  }

  return parts.join(" ");
};

export const formatExpiresDate = (dateTimestamp: number): string => {
  return format(fromUnixTime(dateTimestamp), "MM/yyyy");
};
