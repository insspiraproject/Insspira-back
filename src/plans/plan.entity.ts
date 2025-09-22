import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name: "plans"
})

export class Plan {

    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    name: string	
    
    @Column("numeric", { precision: 10 , scale: 2})
    price: number

    @Column()
    currency: string

    @Column()
    features: string

    @CreateDateColumn()
    createdAt: Date;

}