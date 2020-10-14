import {
  Model,
  Column,
  Table,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import Schedule from './schedule';
import User from './user';

@Table({ tableName: 'sharedSchedules', timestamps: false })
export default class SharedSchedule extends Model<SharedSchedule> {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId!: number;

  @ForeignKey(() => Schedule)
  @AllowNull(false)
  @Column
  scheduleId!: number;
}
