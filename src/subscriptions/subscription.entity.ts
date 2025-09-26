import { Plan } from "src/plans/plan.entity";
import { SubStatus } from "src/status.enum";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity({
    name: "subs"
})



export class Sub {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @OneToOne(() => User, (user)=> user.subFree)
    @JoinColumn({ name: "user_id" })
    user: User

    @ManyToOne(() => Plan, (plan)=> plan.subs)
    @JoinColumn({ name: "plan_id" })
    plan: Plan

    @Column({
    type: "enum",
    enum: SubStatus,
    default: SubStatus.ENABLED,
    })
    status: SubStatus;

    @Column({ default: 0 })
    dailyPosts: number;

    @Column({ default: 0 })
    dailyLikes: number;

    @Column({ default: 0 })
    dailySaves: number;

    @Column({ default: 0 })
    dailyComments: number;

    @Column({ type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP'})
    lastReset: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    start_date: Date;

    @Column({ type: "timestamp", nullable: true })
    end_date: Date;
}