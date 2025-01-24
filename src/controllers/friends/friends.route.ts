import { Router } from 'express';
import { validatorFactory, requireAuth } from '../../middlewares';
import { addFriendsDto } from './friends.dto';
import { addFriend, getFriendList } from './friends.controller';

export const userRouter = Router();
userRouter.use(requireAuth);

userRouter.post('/', validatorFactory(addFriendsDto), addFriend);
userRouter.get('/', getFriendList);
