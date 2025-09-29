// src/pins/entities/view.entity.ts
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Pin } from "./pins.entity";
import { User } from "../entities/user.entity";

@Entity({
    name: "views"
})
export class View {
    @PrimaryGeneratedColumn("uuid")
    id:string

    @ManyToOne(() => Pin, (pin) => pin.likes, {onDelete: "CASCADE"})
    pin: Pin;

    @ManyToOne(() => User, (user) => user.like,{ onDelete: "CASCADE" })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}