import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
import { sequelize } from './model';
import router from './route';
import passport from 'passport';
require('./passport');
import isLoggedIn from './passport/middleware';

import AWS from 'aws-sdk';
const app = express();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

app.use('/auth', router.authRouter);
app.use('/user', isLoggedIn, router.userRouter);
app.use('/schedule', isLoggedIn, router.scheduleRouter);
app.use('/friend', isLoggedIn, router.friendRouter);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello');
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
  sequelize.authenticate().then(async () => {
    console.log('Database connected.');
    try {
      await sequelize.sync({ force: true });
    } catch (error) {
      console.error(error);
    }
  });
});
