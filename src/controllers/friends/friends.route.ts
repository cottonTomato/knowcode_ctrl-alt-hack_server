import { Router } from 'express';
import { validatorFactory, requireAuth } from '../../middlewares';
import { addFriendsDto } from './friends.dto';
import { addFriend, getFriendList, getTop5Friends } from './friends.controller';

export const userRouter = Router();
userRouter.use(requireAuth);

userRouter.post('/', validatorFactory(addFriendsDto), addFriend);
userRouter.get('/', getFriendList);
userRouter.get('/top-5', getTop5Friends);
