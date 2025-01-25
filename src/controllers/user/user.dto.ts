import { z } from 'zod';

export const findUserDto = z.object({
  query: z.string(),
});

export type IFindUser = z.infer<typeof findUserDto>;

export const addEventToCalDto = z.object({
  eventId: z.string(),
});

export type IAddEventToCal = z.infer<typeof addEventToCalDto>;
