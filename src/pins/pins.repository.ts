// src/pins/pins.repository.ts
import { Pin } from "./entities/pins.entity";
import {  In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { pinsDto, updateDto } from "./pinsDtos/pins.dto";
import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { Like } from "./entities/likes.entity";
import { Comment } from "./entities/comments.entity";
import { CommentDto } from "./pinsDtos/comments.dto";
import { User } from "src/users/entities/user.entity";
import { Hashtag } from "./entities/hashtag.entity";
import { Category } from "../categories/category.entity";
import { View } from "./entities/view.entity";
import { Save } from "./entities/save.entity";
import { NotificationsService } from "src/notifications/notifications.service";

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

        @InjectRepository(View)
        private readonly viewRepo: Repository<View>,

        @InjectRepository(Save)
        private readonly saveRepo: Repository<Save>,

        private readonly notificationsService: NotificationsService
    ){}

    // Create Query PINS Repository
    
    async createSearch(query: string) {
        
        return this.pinsRepo
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.hashtags", "h")
        .where("p.description ILIKE :q", {q: `%${query}%`})
        .orWhere("h.tag ILIKE :q", { q: `%${query}%` })
        .getMany()
    }

    // Create PINS Repository

    async getPins(page: number, limit: number): Promise<Pin[]> {
        return await this.pinsRepo.find({
            skip: (page - 1) * 10,
            take: limit,
            order: {createdAt: "DESC"}
        })
    }

    async pinsId(id: string){
        const pin = await this.pinsRepo.findOne({
            where: {id: id},
            relations:["user"]
        })
        return {
            id: pin?.user.id,
            name: pin?.user.username,
            pin: pin?.id,
            image: pin?.image,
            description: pin?.description,
            likes:pin?.likesCount,
            comment: pin?.commentsCount,
            views: pin?.viewsCount,
            created: pin?.createdAt
        }
    }

    async createPins(dtoPin: pinsDto, idUser:string) {

        const initialización = await this.categoryRepo.findOne({where: {id: dtoPin.categoryId}})
        if(!initialización)throw new NotFoundException("Error initializing category.")

        const users = await this.userRepo.findOne({where: {id: idUser}})     
        if(!users)throw new NotFoundException("User does not exist.")

        const create = await this.pinsRepo.create({
            ...dtoPin,
            category: initialización,
            user: users,
            })

        await this.userRepo.increment({id: users.id}, "pinsCount", 1)

        await this.pinsRepo.save(create)

        return {
            id: create.id,
            category: {id: initialización.id},
            user: {
                id: users.id,
                post: users.pinsCount
            },
            image: create.image,   
            description: create.description,
            like: create.likesCount,
            comment: create.commentsCount,
            view: create.views,
            hashtag: create.hashtags,
            date: create.createdAt
            }
    }

    async modifiPins(userId: string, dtoPin: updateDto, pinsId: string, hashtags: { id: string; tag: string }[]) {
        
        const user = await this.userRepo.findOne({where: {id: userId}})
        if(!user) throw new NotFoundException("User not found.")

        const pin = await this.pinsRepo.findOne({where: {id: pinsId}, relations: ["hashtags"]})
        if(!pin) throw new NotFoundException("Post not found.")

        const updatedHashtags: Hashtag[] = []
            for (const h of hashtags) {
            const hashtag = await this.hashtagRepo.findOne({ where: { id: h.id } })
            if (!hashtag) throw new NotFoundException(`Hashtag with id not found.`)

                hashtag.tag = h.tag
            updatedHashtags.push(await this.hashtagRepo.save(hashtag))
            }

        const modifi =  this.pinsRepo.merge(
            pin, {    
                ...dtoPin,
                hashtags: updatedHashtags
            })

        return await this.pinsRepo.save(modifi)
    }

    async deletePins(id: string, userId: string): Promise<Pin> {
        
        const user = await this.userRepo.findOne({where: {id: userId}})
        if(!user) throw new NotFoundException("User not found.")


        const pin = await this.pinsRepo.findOne({where: {id: id}, relations: ["user"]})
        if(!pin) throw new NotFoundException("Error to delete the post.")

        
        if(pin.user.id !== user.id) throw new ForbiddenException("You are not allowed to delete this post.")

        await this.userRepo.decrement({id: user.id}, "pinsCount", 1)

        return await this.pinsRepo.remove(pin)   
    }

    // Create Like PINS Repository

    async createLike(idPin:string, idUser: string) {

        const user = await this.userRepo.findOne({where: {id: idUser}})
        if(!user) throw new NotFoundException("User not found.")

        const pin = await this.pinsRepo.findOne({where: { id: idPin},
        relations: ['user'],
        });
            if (!pin) throw new NotFoundException("Pin not found.");

        const existingLike = await this.likeRepo.findOne({
            where: {pin: {id: pin.id}, user: {id: user.id}},
        });
        if (existingLike) {
            return{message:"You have already liked this post."};
        }
        
        const like = await this.likeRepo.create({pin, user: {id: user.id}}) 

        
        await this.pinsRepo.increment({id: pin.id}, "likesCount", 1);
        await this.likeRepo.save(like);

       
        await this.notificationsService.sendActivity({
            recipientEmail: pin.user.email,
            type: 'like',
            photoTitle: pin.description
        });
        
        return like;

    }

    async deleteLike(id: string, userId:string): Promise<Like> {

        const user = await this.userRepo.findOne({where: {id: userId}})
        if(!user) throw new NotFoundException("User not found.")
        
        const pin = await this.pinsRepo.findOne({where: { id: id}})
        if (!pin) throw new NotFoundException("Pin not found.");
        
        const remove = await this.likeRepo.findOne({
        where: {
            pin: {id: pin.id},
            user: {id: user.id}
        },
        relations:["pin", "user"]
        })
        
        if(!remove) throw new NotFoundException("Post not found.")

        if(remove.user.id !== user.id) throw new ForbiddenException("You are not allowed to delete this like.")

        
        await this.pinsRepo.decrement({id: remove.pin.id}, "likesCount", 1)

        return await this.likeRepo.remove(remove)
    }

    // Create Comment PINS Repository

    async createComment(userId: string, pinId:string , comment: CommentDto) {
        console.log('DTO EN REPO:', comment); // 👈 Aquí
        console.log('COMMENT.TEXT EN REPO:', comment?.text);
        const pin = await this.pinsRepo.findOne({
            where: { id: pinId },
            relations: ['user'],
        });
        
        if(!pin) throw new NotFoundException("Post not found.")
        
        const user = await this.userRepo.findOne({where: {id: userId}})
        if(!user) throw new NotFoundException("User not found.")
        
            const commentCreate = this.commentRepo.create({
            pin,
            user,
            text: comment.text
        })
        await this.commentRepo.save(commentCreate)

        await this.pinsRepo.increment({id: pin.id}, "commentsCount", 1)

        await this.notificationsService.sendActivity({
            recipientEmail: pin.user.email,
            type: 'comment',
            photoTitle: pin.description,
            comment: comment.text
        });
        return {
            user: commentCreate.user.id,
            pin: commentCreate.pin,
            comment: commentCreate.text,
            date: commentCreate.createdAt
        }
    }

    async modifieComment(id: string, comment: CommentDto, userId: string): Promise<Comment> {
        const user = await this.userRepo.findOne({where: {id: userId}})
        if(!user) throw new NotFoundException("User not found.")

        const commentId = await this.commentRepo.findOne({where: {id: id}, relations: ["user"]})
        if(!commentId) throw new NotFoundException("Comment not found.")
        if(commentId.user.id !== user.id) throw new ForbiddenException("You are not allowed to modifie this comment.")  

        const modifiComment = this.commentRepo.merge(commentId, comment)
        return await this.commentRepo.save(modifiComment)
    }

    async deleteComment(id: string, userId: string): Promise<Comment> {
        const user = await this.userRepo.findOne({where: {id: userId}})
        if(!user) throw new NotFoundException("User not found.")

        const commentId = await this.commentRepo.findOne({where: {id: id}, relations:["user", "pin"]}) 
        if(!commentId) throw new NotFoundException("Comment not found.")
        if(commentId.user.id !== user.id) throw new ForbiddenException("You are not allowed to delete this comment.")

        await this.pinsRepo.decrement({id: commentId.pin.id}, "commentsCount", 1)    
        return await this.commentRepo.remove(commentId)
    }

    // Create View PINS Repository

    async createView(idUser: string, idPins: string) {
        const pin = await this.pinsRepo.findOne({where: {id: idPins}})
        if(!pin) throw new NotFoundException("Post not found.")
        
        const user = await this.userRepo.findOne({where: {id: idUser}})
        if(!user) throw new NotFoundException("User not found.")

        const viewCreate = this.viewRepo.create({
            user: {id: user.id},
            pin: {id: pin.id}
        })
    
        await this.pinsRepo.increment({id: pin.id}, "viewsCount", 1)
        await this.viewRepo.save(viewCreate)

        return viewCreate;
    }

    // Create Save PINS Repository

    async createGetSave( idUser:string) {
        const user = await this.userRepo.findOne({ where: { id: idUser } });
        if (!user) throw new NotFoundException("User not found.");

        

        const save = await this.saveRepo.find({
            where: {user: {id: user.id}},
            relations: ["pin"]
        })

       const pins = save.map(e=> e.pin)

       return pins
    }

    async createSave(idPin: string, idUser: string ) {
        
        const pin = await this.pinsRepo.findOne({ where: { id: idPin } });
        if (!pin) throw new NotFoundException("Post not found.");

        const user = await this.userRepo.findOne({ where: { id: idUser } });
        if (!user) throw new NotFoundException("User not found.");


        const existing = await this.saveRepo.findOne({
        where: { user: { id: user.id }, pin: { id: pin.id } },
        });
        if (existing) throw new BadRequestException("This post is already saved.");


        const save = this.saveRepo.create({
            user: {id: user.id},
            pin,
        });

        return await this.saveRepo.save(save);
    }


    async createDeleteSave(id: string, idUser: string) {

        const user = await this.userRepo.findOne({ where: { id: idUser } });
        if (!user) throw new NotFoundException("User not found.");

        const deleteSave = await this.saveRepo.findOne({where: {id: id}, relations: ["user"]})
        if(!deleteSave) throw new NotFoundException("Item not found.")

        if(deleteSave.user.id !== user.id)throw new ForbiddenException("You are not allowed to delete this comment.")

        await this.saveRepo.remove(deleteSave)    
    }

    async getPinsByUser(userId: string, page: number = 1, limit: number = 20): Promise<Pin[]> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User not found.");
    
        // QueryBuilder para obtener pins del usuario con todas las relaciones
        const query = this.pinsRepo
            .createQueryBuilder('pin')
            .leftJoinAndSelect('pin.user', 'user')
            .leftJoinAndSelect('pin.category', 'category')
            .leftJoinAndSelect('pin.hashtags', 'hashtags')
            .leftJoin('pin.likes', 'likes')
            .leftJoin('pin.comments', 'comments')
            .where('pin.userId = :userId', { userId })
            .orderBy('pin.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
    
        const pins = await query.getMany();
        
        return pins;
    }
    
    // Obtener todos los pins que un usuario ha dado like
    async getLikedPins(userId: string, page: number = 1, limit: number = 20): Promise<Pin[]> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User not found.");
    
        // QueryBuilder completo para obtener likes con todas las relaciones del pin
        const query = this.pinsRepo
            .createQueryBuilder('pin')
            .leftJoinAndSelect('pin.user', 'user')
            .leftJoinAndSelect('pin.category', 'category')
            .leftJoinAndSelect('pin.hashtags', 'hashtags')
            .leftJoin('pin.likes', 'likes')
            .leftJoin('pin.comments', 'comments')
            .innerJoin('likes', 'userLikes', 'userLikes.pinId = pin.id AND userLikes.userId = :userId', { userId })
            .where('userLikes.userId = :userId', { userId })
            .orderBy('pin.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
    
        const pins = await query.getMany();
        
        return pins;
    }

    async getUserPinsCount(userId: string): Promise<number> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User not found.");
        
        return user.pinsCount;
    }
}
