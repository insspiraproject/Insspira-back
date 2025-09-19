import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    paymentId: string;

    @Column()
    plan: 'monthly' | 'annual';

    @Column({ default: 'active' })
    status: 'active' | 'cancelled' | 'expired';

    @Column()
    startsAt: Date;

    @Column()
    endsAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}