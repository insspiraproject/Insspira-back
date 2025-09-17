import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne} from 'typeorm';
import { Comment } from '../../pins/entities/comments.entity';
import { Like } from '../../pins/entities/likes.entity';
import { Pin } from '../../pins/entities/pins.entity';
import { v4 as uuid} from "uuid";
import { View } from 'src/pins/entities/view.entity';
import { Save } from 'src/pins/entities/save.entity';


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




    

}