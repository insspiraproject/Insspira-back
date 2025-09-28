
// src/users/entities/user.entity.ts

import { ApiProperty } from '@nestjs/swagger';
import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne} from 'typeorm';
import { Comment } from '../../pins/entities/comments.entity';
import { Like } from '../../pins/entities/likes.entity';
import { Pin } from '../../pins/entities/pins.entity';
import { View } from 'src/pins/entities/view.entity';
import { Save } from 'src/pins/entities/save.entity';
import { Sub } from 'src/subscriptions/subscription.entity';
import { Plan } from 'src/plans/plan.entity';
import { Payment } from 'src/payments/payment.entity';
import { Report } from 'src/reports/report.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ required: false })
  @Column({ unique: true, nullable: true })
  auth0Id: string;

  @ApiProperty({ required: false, maxLength: 50 })
  @Column({ length: 50, nullable: true })
  name: string;

  @ApiProperty({ maxLength: 50 })
  @Column({ length: 50 })
  username: string;

  @ApiProperty({ example: 'john@insspira.com' })
  @Column({ length: 50, unique: true })
  email: string;

  @ApiProperty({ required: false })
  @Column({ type: 'bigint', nullable: true })
  phone: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  password: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  confirmPassword: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  profilePicture: string;

  @ApiProperty({ required: false, maxLength: 150 })
  @Column({ nullable: true, length: 150 })
  biography: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isAdmin: boolean;

  @ApiProperty({ example: 0 })
  @Column({ default: 0 })
  pinsCount: number;

  @OneToMany(() => Pin, (pin) => pin.user)
  pins: Pin[];

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => View, (view) => view.user)
  views: View[];


  @OneToMany(() => Save, (save) => save.user)
  saves: Save[];

  @OneToOne(()=> Sub, (sub)=> sub.user)
  @JoinColumn()
  subFree: Sub

  @OneToMany(() => Payment, (pay)=> pay.user)
  payments: Payment[];

  @OneToMany(()=> Report, (re)=> re.user)
  reports: Report[]

}

