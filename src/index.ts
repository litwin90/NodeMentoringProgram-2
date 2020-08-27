import express from 'express';

import { userRouter } from './routes';

const app: express.Application = express();

app.use(express.json());

app.listen(process.env.PORT);

app.use('/user', userRouter);
