import { Plan } from 'src/plans/plan.entity';
import { SubStatus } from 'src/status.enum';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user)=> user.payments)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Plan, (plan)=> plan.payments)
    @JoinColumn({ name: "plan_id" })
    plan: Plan

    @Column()
    paymentId: string;

    @Column({
        type: 'varchar',
        default: 'monthly'
    })
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