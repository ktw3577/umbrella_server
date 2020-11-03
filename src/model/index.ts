import { Sequelize } from 'sequelize-typescript';
import 'dotenv/config';

const env = process.env.NODE_ENV === 'production';

export const sequelize = new Sequelize({
  database: env
    ? process.env.MYSQL_DATABASE_NAME
    : process.env.LOCAL_MYSQL_DATABASE_NAME,
  username: env ? process.env.MYSQL_USERNAME : process.env.LOCAL_MYSQL_USERNAME,
  password: env ? process.env.MYSQL_PASSWORD : process.env.LOCAL_MYSQL_PASSWORD,
  host: env ? process.env.MYSQL_HOST : '127.0.0.1',
  dialect: 'mysql',
  port: env ? Number(process.env.MYSQL_PORT) : 3306,
  models: [__dirname + '/models'],
});
