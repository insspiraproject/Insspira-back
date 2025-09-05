import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Pin } from "./createPins.entity";



Entity({
    name: "likes"
})

export class Like {

    @PrimaryGeneratedColumn("uuid")
    id:string

    @ManyToOne(() => Pin, (pin) => pin.likes)
    pin: Pin;

    @ManyToOne(() => User, (user) => user.likes)
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}