import { Sequelize } from 'sequelize-typescript';
import 'dotenv/config';

export const sequelize = new Sequelize({
  database: process.env.LOCAL_MYSQL_DATABASE_NAME,
  username: process.env.LOCAL_MYSQL_USERNAME,
  password: process.env.LOCAL_MYSQL_PASSWORD,
  host: 'localhost',
  dialect: 'mysql',
  models: [__dirname + '/models'],
});
