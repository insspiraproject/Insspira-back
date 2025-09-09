import { Pin } from "src/pins/entitys/pins.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name: "categories"
})

export class Categorie {

    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    name: string

    @OneToMany(() => Pin, (pin)=> pin.category)
    pins: Pin[]

}

