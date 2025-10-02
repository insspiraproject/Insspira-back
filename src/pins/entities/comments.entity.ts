// src/pins/entities/comments.entity.ts
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Pin } from "./pins.entity";
import { User } from "../../users/entities/user.entity";

@Entity({
    name: "comments"
})

export class Comment {

  @PrimaryGeneratedColumn("uuid")      
  id: string;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Pin, (pin) => pin.comments, {onDelete: "CASCADE"})
  pin: Pin;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;
  
}
