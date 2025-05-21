import isMobilePhone from "validator/lib/isMobilePhone";
import z from "zod";

// Proper phone number check, won't allow fake numbers
export const mobilePhoneSchemaProper = z.string().refine((val) => {
  return isMobilePhone(val.replace(/\s/g, ""));
}, "Invalid phone number");

// Dummy check, to allow fake numbers used to testing.
export const mobilePhoneSchemaDevOnly = z
  .string()
  .regex(/^\+?[1-9](\d\s?){9,19}$/, "Invalid phone number format");

export const mobilePhoneSchema = mobilePhoneSchemaDevOnly;
