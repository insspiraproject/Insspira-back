import { User } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { Pin } from "./pins.entity";


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
