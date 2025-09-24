import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne} from 'typeorm';
import { Comment } from '../../pins/entities/comments.entity';
import { Like } from '../../pins/entities/likes.entity';
import { Pin } from '../../pins/entities/pins.entity';
import { View } from 'src/pins/entities/view.entity';
import { Save } from 'src/pins/entities/save.entity';
import { Sub } from 'src/subscriptions/subscription.entity';
import { Plan } from 'src/plans/plan.entity';
import { Payment } from 'src/payments/payment.entity';
import { Report } from 'src/reports/report.entity';


@Entity({
    name: "users"
})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true, nullable: true })
    auth0Id: string;

    @Column({length: 50, nullable: true})
    name: string;

    @Column({length: 50})
    username: string;

    @Column({ length:50, unique: true })
    email: string;

    @Column({type:"bigint", nullable: true})
    phone: string;

    @Column({ nullable: true }) 
    password: string;

    @Column({ nullable: true }) 
    confirmPassword: string;

    @Column({ nullable: true })
    profilePicture: string;

    @Column({ default: false }) 
    isAdmin: boolean;

    @Column({default: 0})
    pinsCount: number

    @OneToMany(()=> Pin, (pin)=> pin.user)
    pins: Pin[];

    @OneToMany(()=> Like, (like)=>like.user)
    like: Like[];

    @OneToMany(()=>Comment, (comment)=>comment.user)
    comment: Comment[];

    @OneToMany(() => View, (view) => view.user)
    views: View[];

    @OneToMany(() => Save, (save) => save.user)
    saves: Save[];

    @OneToOne(()=> Sub, (sub)=> sub.user)
    @JoinColumn()
    subFree: Sub

    @OneToOne(()=> Payment, (pay)=> pay.user)
    @JoinColumn()
    subPage: Sub

    @OneToMany(()=> Report, (re)=> re.user)
    reports: Report[]

}