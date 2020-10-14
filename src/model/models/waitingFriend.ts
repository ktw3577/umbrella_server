import {
  ForeignKey,
  Model,
  AllowNull,
  Column,
  Table,
} from 'sequelize-typescript';
import User from './user';

@Table({ tableName: 'waitingFriends', timestamps: false })
export default class WaitingFriend extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  applicant!: number;
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  receiver!: number;
}
