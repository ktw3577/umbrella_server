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
  minutes: number;
  hour: number;
  note: string;
  placeName: string;
  latitude: string;
  longitude: string;
}

@Table({ tableName: 'todos', timestamps: true })
export default class Todo extends Model implements TodoI {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column
  placeName!: string;

  @AllowNull(false)
  @Column
  latitude!: string;

  @AllowNull(false)
  @Column
  longitude!: string;

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
