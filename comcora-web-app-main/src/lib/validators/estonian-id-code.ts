import zod from "zod";

export const estonianIdSchema = zod.string().refine(
  (value) => {
    if (value.length !== 11) return false;

    const firstDigit = parseInt(String(value[0]), 10);
    if (![1, 2, 3, 4, 5, 6].includes(firstDigit)) return false;

    const year = parseInt(value.substring(1, 3), 10);
    const month = parseInt(value.substring(3, 5), 10);
    const day = parseInt(value.substring(5, 7), 10);

    if (year < 0 || month < 1 || month > 12 || day < 1 || day > 31)
      return false;

    // Validation of the last digits part is omitted for simplicity but should be implemented if we need a complete validation.

    return true;
  },
  {
    message: "Invalid Estonian personal identification code",
  }
);
