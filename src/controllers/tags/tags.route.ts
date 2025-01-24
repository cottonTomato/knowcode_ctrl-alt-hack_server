import { Router } from 'express';
import { getTags } from './tags.controller';

export const tagsRouter = Router();

tagsRouter.get('/', getTags);
