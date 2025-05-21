import { z } from "zod";

// import { zfd } from "zod-form-data";

export const userAliasValidationScheme = z.string().min(1);
export const userEmailValidationScheme = z.string().min(1);
export const userPhoneValidationScheme = z.string().min(1);
export const userAddressValidationScheme = z.object({
  country: z.string(),
  state: z.string(),
  city: z.string(),
  streetAddressAndApartment: z.string(),
  postalCode: z.string(),
});
// export const userAvatarValidationScheme = zfd.formData({
//   name: zfd.text(),
//   image: zfd.file(),
// });
