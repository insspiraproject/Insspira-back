import { Pin } from "../pins/entities/pins.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "categories"
})

export class Category {
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    name: string

    @OneToMany(() => Pin, (pin)=> pin.category)
    pins: Pin[]
}

