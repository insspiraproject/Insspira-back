import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Comment } from "./commentsPins.entity"
import {Like} from "./likePins.entity"
import { Categori } from "src/categories/categorie.entity"

Entity({
    name: "pins"
})

export class Pin {

    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    image: string   

    @Column()
    description: string

    @Column({ default: 0 })
    likesCount: number;

    @Column({ default: 0 })
    commentsCount: number;

    @Column({ default: 0 })
    views: number; 

    @ManyToOne(()=> Categori, (cat)=> cat.pins)
    category: Categori

    @ManyToOne()
    user_id: User 

    @OneToMany(() => Like, (like) => like.pin)
    likes: Like[];

    @OneToMany(() => Comment, (comment) => comment.pin)
    comment: Comment[];
}