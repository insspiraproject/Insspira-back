import { Pin } from "./entities/pins.entity";
import {  In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { pinsDto, updateDto } from "./pinsDtos/pins.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateLikeDto } from "./pinsDtos/like.dto";
import { Like } from "./entities/likes.entity";
import { Comment } from "./entities/comments.entity";
import { CommentDto } from "./pinsDtos/comments.dto";
import { User } from "src/users/entities/user.entity";
import { Hashtag } from "./entities/hashtag.entity";
import { Category } from "../categories/category.entity";

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
        private readonly userRepo: Repository<User>,

        @InjectRepository(Hashtag)
        private readonly hashtagRepo: Repository<Hashtag>,
    ){}

    async getPins(): Promise<Pin[]> {
        return await this.pinsRepo.find()
    }

    async pinsId(id: string): Promise<Pin | null>{
        return await this.pinsRepo.findOne({where: {id: id}})
    }



    async createPins(dtoPin: pinsDto, idCategory:string, idUser:string) {

        const initialización = await this.categoryRepo.findOne({where: {id: idCategory}})
        if(!initialización)throw new NotFoundException("Error initializing category.")

        const users = await this.userRepo.findOne({where: {id: idUser}})     
        if(!users)throw new NotFoundException("User does not exist.")

        const create = await this.pinsRepo.create({
            ...dtoPin,
            category: initialización,
            user: users,
            })

        await this.pinsRepo.save(create)

        return {
            id: create.id,
            category: {id: initialización.id},
            user: {id: users.id},
            image: create.image,   
            description: create.description,
            like: create.likesCount,
            comment: create.commentsCount,
            view: create.views,
            hashtag: create.hashtags
            }
    }

    async modifiPins(dtoPin: updateDto, userId: string, hashtagId:string[]): Promise<Pin> {
        const pin = await this.pinsRepo.findOne({where: {id: userId}})
        if(!pin) throw new NotFoundException("Error to modify the post.")

        const hashtag = await this.hashtagRepo.findOne({where: {id: In(hashtagId)}})
        if(!hashtag) throw new NotFoundException("Hashtag not found.")

        const modifi =  this.pinsRepo.merge(
            pin, {    
                ...dtoPin,
                hashtags: [hashtag]
            })

        return await this.pinsRepo.save(modifi)
    }


    async deletePins(id: string): Promise<Pin> {
        const pin = await this.pinsRepo.findOneBy({id: id})

        if(!pin) throw new NotFoundException("Error to delete the post.")

        return await this.pinsRepo.remove(pin)   
    }

    async createLike(idPin:string, idUser: string): Promise<Like | { message: string;}> {
        const pin = await this.pinsRepo.findOne({where: { id: idPin}})
            if (!pin) throw new NotFoundException("Pin not found.");

        const existingLike = await this.likeRepo.findOne({
            where: {pin: {id: idPin}, user: {id: idUser}},
        });
        if (existingLike) return{message:"You have already liked this post."};
        
        const like = await this.likeRepo.create({pin, user: {id: idUser}}) 
        await this.likeRepo.save(like);
        
        await this.pinsRepo.increment({id: idPin}, "likesCount", 1)
        
        return like;

    }

    async deleteLike(id: string): Promise<Like> {
        const remove = await this.likeRepo.findOne({where: {
            id: id,},
        relations:["pin"]
        })
        
        if(!remove) throw new NotFoundException("Post not found.")
        
        await this.pinsRepo.decrement({id: remove.pin.id}, "likesCount", 1)
        return await this.likeRepo.remove(remove)
    }

    async createComment(userId: string, pinId:string , comment: CommentDto) {
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

        await this.pinsRepo.increment({id: pin.id}, "commentsCount", 1)

        return {
            user: commentCreate.user.id,
            pin: commentCreate.pin,
            comment: commentCreate.text,
            date: commentCreate.createdAt
        }
    }

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

    async createSearch(query: string) {
        
        return this.pinsRepo
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.hashtags", "h")
        .where("p.description ILIKE :q", {q: `%${query}%`})
        .orWhere("h.tag ILIKE :q", { q: `%${query}%` })
        .getMany()
    }
}
