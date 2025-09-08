import {  Repository } from "typeorm";
import { Pin } from "./entities/pins.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { pinsDto } from "./pinsDtos/pins.dto";
import { NotFoundException } from "@nestjs/common";
import { CreateLikeDto } from "./pinsDtos/like.dto";
import { Like } from "./entities/likes.entity";
import { Comment } from "./entities/comments.entity";
import { CommentDto } from "./pinsDtos/comments.dto";
import { User } from "src/users/entities/user.entity";
import { Category } from "src/categories/category.entity";

export class PinsRepository {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,

        @InjectRepository(Pin)
        private readonly pinsRepo: Repository<Pin>,

        @InjectRepository(Like)
        private readonly likeRepo: Repository<Like>,

        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ){}

    async getPins(): Promise<Pin[]> {
        return await this.pinsRepo.find()
    }

    async pinsId(id: string): Promise<Pin | null>{
        return await this.pinsRepo.findOne({where: {id: id}})
    }

    async createPins(dtoPin: pinsDto) {
        const initialization = await this.categoryRepo.findOne({where: {id: dtoPin.categoryId}})
        if(!initialization)throw new NotFoundException("Error to initialize the category.")

        const create = await this.pinsRepo.create({
            ...dtoPin,
            category: initialization,
            user: {id: dtoPin.userId} as any
            })

        await this.pinsRepo.save(create)

        return {
            id: create.id,
            category: {id: initialization.id},
            user: {id: dtoPin.userId},
            image: create.image,   
            description: create.description,
            like: create.likesCount,
            comment: create.commentsCount,
            view: create.views
            } 
    }

    async modifiPins(dtoPin: pinsDto, id: string): Promise<Pin> {
        const pin = await this.pinsRepo.findOne({where: {id: id}})

        if(!pin) throw new NotFoundException("Error to modify the post.")

        const modify =  this.pinsRepo.merge(pin, dtoPin)

        return this.pinsRepo.save(modify)
    }


    async deletePins(id: string): Promise<Pin> {
        const pin = await this.pinsRepo.findOneBy({id: id})

        if(!pin) throw new NotFoundException("Error to delete the post.")

        return await this.pinsRepo.remove(pin)   
    }



    async createLike(likeDto: CreateLikeDto, id: string): Promise<Like | { message: string;}> {
        const pin = await this.pinsRepo.findOne({where: { id: likeDto.pinId}})
            if (!pin) throw new NotFoundException("Pin not found.");

        const existingLike = await this.likeRepo.findOne({
            where: {pin: {id: likeDto.pinId}, user: {id: id}},
        });
        if (existingLike) return{message:"You have already liked this post."};

        const like = await this.likeRepo.create({pin, user: {id: id}}) 

        return await this.likeRepo.save(like);
    }



    async deleteLike(id: string): Promise<Like> {
        const remove = await this.likeRepo.findOne({where: {id: id}})
        
        if(!remove) throw new NotFoundException("Post not found.")

        return await this.likeRepo.remove(remove)    
    }

    async createComment(userId: string, pinId:string , comment: CommentDto): Promise<{
        user: User;
        post: Pin;
        comment: string;
        date: Date;
    }> {
        const pin = await this.pinsRepo.findOne({where: {id: pinId}})
        if(!pin) throw new NotFoundException("Post not found.")
        
        const user = await this.userRepo.findOne({where: {id: userId}})
        if(!user) throw new NotFoundException("Post not found.")
        
            const commentCreate = this.commentRepo.create({
            pin,
            user,
            text: comment.text,
        })

        await this.commentRepo.save(commentCreate)

        return {
            user: commentCreate.user,
            post: commentCreate.pin,
            comment: commentCreate.text,
            date: commentCreate.createdAt
        }}

    async modifieComment(id:string, comment: CommentDto): Promise<Comment> {
        const commentId = await this.commentRepo.findOne({where: {id: id}})
        if(!commentId) throw new NotFoundException("Comment not found.")

        const modifiComment = this.commentRepo.merge(commentId, comment)
        return await this.commentRepo.save(modifiComment)
    }

    async deleteComment(id: string): Promise<Comment> {
        const commentId = await this.commentRepo.findOne({where: {id: id}}) 
        if(!commentId) throw new NotFoundException("Comment not found.")

        return await this.commentRepo.remove(commentId)
    }


}
