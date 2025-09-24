import { SubStatus } from 'src/status.enum';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user)=> user.subPage)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    paymentId: string;

    @Column()
    plan: 'monthly' | 'annual';

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

    @CreateDateColumn()
    createdAt: Date;
}


 