import { Router } from 'express';
import { requireAuth, validatorFactory } from '../../middlewares';
import {
  onBoardUser,
  getMonthlyContributions,
  getUserByEmail,
  getTopUsers,
  addEventToCalendar,
} from './user.controller';
import { addEventToCalDto, findUserDto } from './user.dto';

export const userRouter = Router();
userRouter.use(requireAuth);

userRouter.post('/onboard', onBoardUser);
userRouter.get('/monthly-contributions', getMonthlyContributions);
userRouter.get('/email-search', validatorFactory(findUserDto), getUserByEmail);
userRouter.get('/top', getTopUsers);
userRouter.post(
  '/event-cal',
  validatorFactory(addEventToCalDto),
  addEventToCalendar
);
