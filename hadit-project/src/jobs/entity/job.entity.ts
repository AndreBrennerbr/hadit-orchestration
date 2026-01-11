import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { JobsStatus } from '../enum/jobs-status';
import type { cron } from '../type/cron-type';

@Entity()
export class JobEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  command: string;

  @Column()
  payload: string;

  @Column()
  status: JobsStatus;

  @Column()
  scheduled?: cron;

  @Column()
  user_id: number;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime' })
  updatedAt: Date;
}
