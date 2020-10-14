import {
  Model,
  Column,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  BelongsToMany,
  HasMany,
  Scopes,
} from 'sequelize-typescript';
import Friend from './friend';
import Schedule from './schedule';
import SharedSchedule from './sharedSchedule';
import WaitingFriend from './waitingFriend';

@Scopes(() => ({
  followers: {
    include: [
      {
        model: User,
        as: 'followers',
        through: { attributes: [] },
      },
    ],
  },
  applicants: {
    include: [
      {
        model: User,
        as: 'applicants',
        through: { attributes: [] },
      },
    ],
  },
  friendSchedules: {
    include: [
      {
        model: Schedule,
        as: 'friendSchedules',
        through: { attributes: [] },
      },
    ],
  },
}))
@Table({ tableName: 'users', timestamps: true })
export default class User extends Model<User> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column
  username!: string;

  @AllowNull(true)
  @Column
  userId: string;

  @AllowNull(true)
  @Column
  avatarUrl: string;

  @BelongsToMany(() => User, () => Friend, 'follower')
  followers: Array<User & { Friend: Friend }>;

  @BelongsToMany(() => User, () => Friend, 'following')
  followings: Array<User & { Friend: Friend }>;

  @BelongsToMany(() => User, () => WaitingFriend, 'applicant', 'receiver')
  applicants: Array<User & User>;

  @BelongsToMany(() => User, () => WaitingFriend, 'receiver', 'applicant')
  receivers: Array<User & User>;

  @HasMany(() => Schedule)
  mySchedules: Schedule[];

  @BelongsToMany(() => Schedule, () => SharedSchedule, 'userId')
  friendSchedules: Array<Schedule & { SharedSchedule: SharedSchedule }>;
}
