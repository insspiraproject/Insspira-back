import { Plan } from 'src/entities/plan.entity';
import { SubStatus } from 'src/rest/types/status.enum';

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user)=> user.subPage)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Plan, (plan)=> plan.payments)
    @JoinColumn({ name: "plan_id" })
    plan: Plan


    @Column()
    paymentId: string;

    @Column()
    billingCycle: 'monthly' | 'annual';

     @Column({
        type: "enum",
        enum: SubStatus,
        default: SubStatus.ACTIVE,
        })
    status: SubStatus;

    @Column()
    startsAt: Date;

    @Column()
    endsAt: Date;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    amount: number;

    @CreateDateColumn()
    createdAt: Date;
}


 