import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Comment } from "./comments.entity"
import {Like} from "./likes.entity"
import { Categori } from "src/categories/categorie.entity"
import { User } from "src/users/entities/user.entity"
import { Hashtag } from "./hashtag.entity"

@Entity({
    name: "pins"
})

export class Pin {

    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    image: string   

    @Column({unique: false})
    description: string

    @Column({ default: 0 })
    likesCount: number;

    @Column({ default: 0 })
    commentsCount: number;

    @Column({ default: 0 })
    views: number; 

    @ManyToOne(()=> Categori, (cat) => cat.pins)
    category: Categori

    @ManyToOne(() => User, (user) => user.pins)
    user: User 

    @OneToMany(() => Like, (like) => like.pin)
    likes: Like[];

    @OneToMany(() => Comment, (comment) => comment.pin)
    comment: Comment[];

    @ManyToMany(() => Hashtag, (hashtag) => hashtag.pins, { cascade: true })
    @JoinTable()
    hashtags: Hashtag[];
}