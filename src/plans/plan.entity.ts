// src/entities/plan.entity.ts
import { Payment } from "src/payments/payment.entity";
import { Sub } from "src/subscriptions/subscription.entity";
import { User } from "src/users/entities/user.entity";
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany
} from 'typeorm';

    @Entity({ name: 'plans' })

    export class Plan {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 16, nullable: true })
    type: 'free' | 'monthly' | 'annual' ;
    
    @Column({ length: 50 })
    name: string;

    @Column({ type: 'numeric', precision: 10 , scale: 2, default: 0})
    price: number;


    @Column({ type: 'varchar', length: 10, default: 'USD' })
    currency: string;

    @Column({ type: 'text', nullable: true })
    features: string | null;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    

    @OneToMany(()=> Sub, (sub)=> sub.plan)
    subs: Sub[]

    @OneToMany(()=> Payment, (pay)=> pay.plan)
    payments: Payment[]
    
    }