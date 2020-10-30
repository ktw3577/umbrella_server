import {
  Model,
  Column,
  Table,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import Schedule from './schedule';

export interface TodoI {
  id: number;
  location: string;
  minutes: number;
  hour: number;
}

@Table({ tableName: 'todos', timestamps: true })
export default class Todo extends Model implements TodoI {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column
  location!: string;

  @AllowNull(false)
  @Column
  hour!: number;

  @AllowNull(false)
  @Column
  minutes!: number;

  @AllowNull(true)
  @Column
  note: string;

  @ForeignKey(() => Schedule)
  @AllowNull(false)
  @Column
  scheduleId!: number;

  @BelongsTo(() => Schedule)
  schedule: Schedule;
}
