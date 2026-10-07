import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "请填写邮箱").email("请输入有效邮箱"),
  password: z.string().min(1, "请填写密码").min(8, "密码至少需要 8 位"),
});

export type LoginInput = z.infer<typeof loginSchema>;
