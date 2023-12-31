import * as z from "zod";

export const StreamValidation = z.object({
    stream: z.string().nonempty().min(1),
    accountId: z.string()
})

export const CommentValidation = z.object({
    stream: z.string().nonempty().min(1)
})