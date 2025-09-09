import { Comment } from 'src/pins/entitys/comments.entity';
import { Like } from 'src/pins/entitys/likes.entity';
import { Pin } from 'src/pins/entitys/pins.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity({
    name: "users"
})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true, nullable: true })
    auth0Id: string;

    @Column({length: 50})
    username: string;

    @Column({ length:50, unique: true })
    email: string;

    @Column({type:"bigint", nullable: true})
    phone: string;

    @Column()
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