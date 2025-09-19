import { Sub } from "src/subscriptions/subscription.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


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

    @OneToMany(()=> Sub, (sub)=> sub.plan)
    subs: Sub[]


}