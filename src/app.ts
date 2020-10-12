import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
  })
);

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello');
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
