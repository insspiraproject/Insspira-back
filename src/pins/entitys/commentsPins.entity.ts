
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Pin } from "./createPins.entity";



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

  @ManyToOne(() => Pin, (pin) => pin.comment)
  pin: Pin;

  @ManyToOne(() => User, (user) => user.comment)
  user: User;
}
