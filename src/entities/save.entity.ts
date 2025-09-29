// src/pins/entities/save.entity.ts

import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { Pin } from "./pins.entity";
import { User } from "./user.entity";


@Entity({ name: "saves" })

export class Save {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.saves, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Pin, (pin) => pin.saves, { onDelete: "CASCADE" })
  pin: Pin;

  @CreateDateColumn()
  createdAt: Date;
}
