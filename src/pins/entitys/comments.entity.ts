
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Pin } from "./pins.entity";
import { User } from "src/users/entities/user.entity";



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

  @ManyToOne(() => Pin, (pin) => pin.comment, {onDelete: "CASCADE"})
  pin: Pin;

  @ManyToOne(() => User, (user) => user.comment)
  user: User;
}
