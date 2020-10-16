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
  date: string;
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
  date!: string;

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
