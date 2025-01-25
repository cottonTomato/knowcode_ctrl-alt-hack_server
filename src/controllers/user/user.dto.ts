import { z } from 'zod';

export const findUserDto = z.object({
  query: z.string(),
});

export type IFindUser = z.infer<typeof findUserDto>;
