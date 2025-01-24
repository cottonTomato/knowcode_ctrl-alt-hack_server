import express from 'express';
import 'express-async-errors';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { clerkMiddleware } from '@clerk/express';

import { port, allowedOrigin } from './common/config';
import {
  accessLogger,
  notFoundHandler,
  globalErrorHandler,
} from './middlewares';
import { userRouter, tagsRouter } from './controllers';

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(accessLogger);

app.get('/', (_req, res) => {
  res.send('<h1>Hello, World</h1>');
});
app.use('/tag', tagsRouter);
app.use('/user', clerkMiddleware(), userRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

httpServer.listen(port, () => {
  console.log(`Server Listening to port: ${port}...`);
});
