import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Comment } from "./comments.entity"
import {Like} from "./likes.entity"
import { Category } from "../../categories/category.entity"
import { User } from "src/users/entities/user.entity"
import { Hashtag } from "./hashtag.entity"
import { View } from "./view.entity"
import { Save } from "./save.entity"

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
    viewsCount: number; 

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(()=> Category, (cat) => cat.pins)
    category: Category

    @ManyToOne(() => User, (user) => user.pins)
    @JoinColumn({ name: "userId" })
    user: User 

    @OneToMany(() => Like, (like) => like.pin)
    likes: Like[];

    @OneToMany(() => Comment, (comment) => comment.pin)
    comment: Comment[];

    @ManyToMany(() => Hashtag, (hashtag) => hashtag.pins, { cascade: true })
    @JoinTable()
    hashtags: Hashtag[];

    @OneToMany(() => View, (view) => view.pin)
    views: View[];

    @OneToMany(() => Save, (save) => save.pin)
    saves: Save[];

}