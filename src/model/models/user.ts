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
import Todo from './todo';
import WaitingFriend from './waitingFriend';

@Scopes(() => ({
  followers: {
    attributes: ['id', 'username', 'avatarUrl'],
    include: [
      {
        model: User,
        as: 'followers',
        attributes: ['id', 'username', 'avatarUrl'],
        through: { attributes: [] },
      },
    ],
  },
  applicants: {
    attributes: ['id', 'username', 'avatarUrl'],
    include: [
      {
        model: User,
        as: 'applicants',
        attributes: ['id', 'username', 'avatarUrl'],
        through: { attributes: [] },
      },
    ],
  },
  complexFunction(friendId: number) {
    return {
      attributes: ['id', 'avatarUrl', 'username'],
      include: [
        {
          model: Schedule,
          as: 'friendSchedules',
          through: {
            attributes: [],
          },
          where: { creator: friendId },
          include: [{ model: Todo, as: 'todos' }],
        },
      ],
    };
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

  @AllowNull(false)
  @Column
  provider: string;

  @AllowNull(false)
  @Column
  snsId: string;

  @AllowNull(true)
  @Column
  refreshToken: string;

  @AllowNull(false)
  @Column
  accessToken: string;

  @AllowNull(true)
  @Column
  pushToken: string;

  @BelongsToMany(() => User, () => Friend, 'follower', 'following')
  followers: Array<User & { Friend: Friend }>;

  @BelongsToMany(() => User, () => Friend, 'following', 'follower')
  followings: Array<User & { Friend: Friend }>;

  @BelongsToMany(() => User, () => WaitingFriend, 'applicant', 'receiver')
  receivers: Array<User & User>;

  @BelongsToMany(() => User, () => WaitingFriend, 'receiver', 'applicant')
  applicants: Array<User & User>;

  @HasMany(() => Schedule)
  mySchedules: Schedule[];

  @BelongsToMany(() => Schedule, () => SharedSchedule, 'targetUser')
  friendSchedules: Array<Schedule & { SharedSchedule: SharedSchedule }>;

  @HasMany(() => SharedSchedule, 'shareUser')
  sharingList: SharedSchedule[];
}
