import { z } from 'zod';

export const addFriendsDto = z.object({
  friendId: z.string(),
});

export type IAddFriendsDto = z.infer<typeof addFriendsDto>;
