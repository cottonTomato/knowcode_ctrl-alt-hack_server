import { Router } from 'express';
import { validatorFactory, requireAuth } from '../../middlewares';
import { addFriendsDto } from './friends.dto';
import { addFriend, getFriendList, getTop5Friends } from './friends.controller';

export const friendRouter = Router();
friendRouter.use(requireAuth);

friendRouter.post('/', validatorFactory(addFriendsDto), addFriend);
friendRouter.get('/', getFriendList);
friendRouter.get('/top-5', getTop5Friends);
