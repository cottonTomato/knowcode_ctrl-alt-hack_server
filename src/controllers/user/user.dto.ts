import { z } from 'zod';

export const userOnbordingDto = z.object({});

export type IUserOnboardDto = z.infer<typeof userOnbordingDto>;
