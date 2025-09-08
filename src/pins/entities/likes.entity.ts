import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Pin } from "./pins.entity";
import { User } from "src/users/entities/user.entity";

@Entity({
    name: "likes"
})

export class Like {
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ManyToOne(() => Pin, (pin) => pin.likes)
    pin: Pin;

    @ManyToOne(() => User, (user) => user.like)
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}