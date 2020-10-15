import {
  Model,
  Column,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
  HasMany,
  Scopes,
} from 'sequelize-typescript';
import SharedSchedule from './sharedSchedule';
import Todo from './todo';
import User from './user';

@Scopes(() => ({
  sharedSchedules: {
    include: [
      {
        model: User,
        as: 'sharedSchedules',
        through: { attributes: [] },
      },
    ],
  },
}))
@Table({ tableName: 'schedules', timestamps: true })
export default class Schedule extends Model<Schedule> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column
  title!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  creator!: number;

  @BelongsTo(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  @BelongsToMany(() => User, () => SharedSchedule, 'scheduleId')
  sharedSchedules: Array<User & { SharedSchedule: SharedSchedule }>;

  @HasMany(() => Todo)
  todos: Todo[];
}
