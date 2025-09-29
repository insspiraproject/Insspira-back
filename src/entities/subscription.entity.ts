import { Plan } from "src/entities/plan.entity";
import { SubStatus } from "src/rest/types/status.enum";

import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";



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