import {
  Model,
  Column,
  Table,
  ForeignKey,
  AllowNull,
  Scopes,
  BelongsTo,
} from 'sequelize-typescript';
import Schedule from './schedule';
import User from './user';

@Scopes(() => ({
  scheduleId: {
    include: [
      {
        model: Schedule,
        as: 'scheduleId',
        through: { attributes: [] },
      },
    ],
  },
}))
@Table({ tableName: 'sharedSchedules', timestamps: false })
export default class SharedSchedule extends Model<SharedSchedule> {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  targetUser!: number;

  @ForeignKey(() => Schedule)
  @AllowNull(false)
  @Column
  scheduleId!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  shareUser!: number;

  @BelongsTo(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;
}
