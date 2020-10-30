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
import { createServer } from 'http';
//import SocketIO from 'socket.io';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import User from './model/models/user';

import AWS from 'aws-sdk';
const app = express();
const expo = new Expo();
const http = createServer(app);
//const io = SocketIO(http);

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

//푸쉬알림 요청
app.post('/pushAlarm', (req, res) => {
  handlePushMessage(req.body);
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

const handlePushMessage = (message: ExpoPushMessage) => {
  const pushToken = message.to;
  let notifications: ExpoPushMessage[] = [];
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
  }
  notifications.push(message);
  console.log(notifications);
  let chunks = expo.chunkPushNotifications(notifications);
  (async () => {
    for (let chunk of chunks) {
      try {
        let receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

/* io.sockets.on('connection', socket => {
  socket.on('login', data => {
    User.update({ socktId: socket.id }, { where: { id: data.id } }).then(() => {
      console.log('login detected');
    });
  });
  socket.on('disconnect', () => {
    User.update({ socketId: '' }, { where: { socketId: socket.id } }).then(
      () => {
        console.log('disconnect detected');
      }
    );
  });
  socket.on('push', async data => {
    const user = await User.findOne({
      where: {
        id: data.userId,
      },
      attributes: ['id', 'socketId'],
    });
    const friend = await User.findOne({
      where: {
        id: data.friendId,
      },
      attributes: ['id', 'socketId', 'pushToken'],
    });
    const socketsInfo = {
      user: {
        id : 
      },
      friend: friend,
    };
    io.to(friend.socketId).emit('push2', socketsInfo);
  });
});
 */
http.listen(3000, () => {
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

/* app.listen(3000, () => {
  console.log('http://localhost:3000');
  sequelize.authenticate().then(async () => {
    console.log('Database connected.');
    try {
      await sequelize.sync({ force: false });
    } catch (error) {
      console.error(error);
    }
  });
}); */
