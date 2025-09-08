import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from '../../pins/entities/comments.entity';
import { Like } from '../../pins/entities/likes.entity';
import { Pin } from '../../pins/entities/pins.entity';
import { v4 as uuid} from "uuid";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string = uuid();

    @Column({ unique: true, nullable: true })
    auth0Id: string;

    @Column({length: 50})
    username: string;

    @Column({ length:50, unique: true })
    email: string;

    @Column({type:"bigint", nullable: true})
    phone: string;

    @Column({ type: "date", nullable: true })
    birthdate: Date;

    @Column({ nullable: true }) 
    password: string;

    @Column({ default: false }) 
    isAdmin: boolean;

    @OneToMany(()=> Pin, (pin)=> pin.user)
    pins: Pin[];

    @OneToMany(()=> Like, (like)=>like.user)
    like: Like[];

    @OneToMany(()=>Comment, (comment)=>comment.user)
    comment: Comment[];
}