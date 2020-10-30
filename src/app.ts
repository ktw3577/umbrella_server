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
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import User from './model/models/user';

import AWS from 'aws-sdk';
const app = express();
const expo = new Expo();

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

const handlePushMessage = (message: ExpoPushMessage) => {
  const pushToken = message.to;
  const notifications: ExpoPushMessage[] = [];
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
  }
  notifications.push(message);
  console.log(notifications);
  const chunks = expo.chunkPushNotifications(notifications);
  (async () => {
    for (const chunk of chunks) {
      try {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

//푸쉬알림 요청
app.post('/pushAlarm', async (req, res) => {
  await handlePushMessage(req.body);
  console.log(`Received message, ${req.body}`);
  res.send(`Received message, ${req.body}`);
});
//토큰저장 요청
app.patch('/pushToken', async (req, res) => {
  const { id } = req.user;
  await User.update({ pushToken: req.body.token.value }, { where: { id: id } });
  console.log(`Received push token, ${req.body.token.value}`);
  res.send(`Received push token, ${req.body.token.value}`);
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
  sequelize.authenticate().then(async () => {
    console.log('Database connected.');
    try {
      await sequelize.sync({ force: false });
    } catch (error) {
      console.error(error);
    }
  });
});
