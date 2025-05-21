import zod from "zod";

export const comcoraUsernameSchema = zod.string().min(2).max(20);
