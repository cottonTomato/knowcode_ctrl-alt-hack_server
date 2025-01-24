import { ReqHandler } from '../../types';
import { IUserOnboardDto } from './user.dto';
import { db } from '../../db/db';
import { StatusCodes } from 'http-status-codes';

type AddUserHandler = ReqHandler<IUserOnboardDto>;

export const addUserHandler: AddUserHandler = async function (req, res) {};
