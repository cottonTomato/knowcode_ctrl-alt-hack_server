import { Router } from 'express';
import { validatorFactory, requireAuth } from '../../middlewares';
import { addFriendsDto } from './events.dto';
import { addFriend, getFriendList } from './events.controller';

export const userRouter = Router();
userRouter.use(requireAuth);

userRouter.post('/', validatorFactory(addFriendsDto), addFriend);
userRouter.get('/', getFriendList);
