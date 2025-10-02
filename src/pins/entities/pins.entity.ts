// src/pins/entities/pins.entity.ts
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from './comments.entity';
import { Like } from './likes.entity';
import { Category } from '../../categories/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Hashtag } from './hashtag.entity';
import { View } from './view.entity';
import { Save } from './save.entity';


@Entity({ name: 'pins' })

export class Pin {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../image.jpg' })
  @Column()
  image: string;

  @ApiProperty({ example: 'Scandinavian living room' })
  @Column({ unique: false })
  description: string;

  @ApiProperty({ example: 10 })
  @Column({ default: 0 })
  likesCount: number;

  @ApiProperty({ example: 2 })
  @Column({ default: 0 })
  commentsCount: number;

  @Column({default: false})
  likesView: boolean

  @ApiProperty({ example: 128 })
  @Column({ default: 0 })
  viewsCount: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Category, (cat) => cat.pins)
  category: Category;

  @ManyToOne(() => User, (user) => user.pins)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Like, (like) => like.pin)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.pin)
  comments: Comment[];

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.pins, { cascade: true })
  @JoinTable()
  hashtags: Hashtag[];

  @OneToMany(() => View, (view) => view.pin)
  views: View[];

  @OneToMany(() => Save, (save) => save.pin)
  saves: Save[];
  
}
