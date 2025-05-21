import zod from "zod";

export const passwordSchema = zod.string().min(6).max(20);
