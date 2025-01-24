import { Router } from 'express';
import { getEvents } from './events.controller';

export const eventRouter = Router();

eventRouter.get('/', getEvents);
