import {
  ForeignKey,
  Model,
  AllowNull,
  Column,
  Table,
} from 'sequelize-typescript';
import User from './user';

@Table({ tableName: 'friends', timestamps: false })
export default class Friend extends Model<Friend> {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  following!: number;
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  follower!: number;
}
