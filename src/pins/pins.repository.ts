import {  In, Repository } from "typeorm";
import { Pin } from "./entitys/pins.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { pinsDto, updateDto } from "./pinsDtos/pins.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateLikeDto } from "./pinsDtos/like.dto";
import { Like } from "./entitys/likes.entity";
import { Comment } from "./entitys/comments.entity";
import { CommentDto } from "./pinsDtos/comments.dto";
import { User } from "src/users/entities/user.entity";
import { Categorie } from "src/categories/categorie.entity";
import { Hashtag } from "./entitys/hashtag.entity";





export class PinsRepository {
    
    

    constructor(
        @InjectRepository(Categorie)
        private readonly categoriRepo: Repository<Categorie>,

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


    async createPins(dtoPin: pinsDto, idCategori:string, idUser:string) {

        const initialización = await this.categoriRepo.findOne({where: {id: idCategori}})
        if(!initialización)throw new NotFoundException("Error al inicializar la categoria")

        const users = await this.userRepo.findOne({where: {id: idUser}})     
        if(!users)throw new NotFoundException("El usuario no existe.")

        

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
        if(!pin) throw new NotFoundException("Error al modidificar una publicación.")

        const hashtag = await this.hashtagRepo.findOne({where: {id: In(hashtagId)}})
        if(!hashtag) throw new NotFoundException("No se encontro el Hashtag.")

        const modifi =  this.pinsRepo.merge(
            pin, {    
                ...dtoPin,
               hashtags: [hashtag]
            })

        return await this.pinsRepo.save(modifi)
    
    }


    async deletePins(id: string): Promise<Pin> {
        const pin = await this.pinsRepo.findOneBy({id: id})

        if(!pin) throw new NotFoundException("Error al querer eliminar una publicación.")

        return await this.pinsRepo.remove(pin)   
    }



    async createLike(likeDto: CreateLikeDto, id: string): Promise<Like | {
        message: string;
        }> {
        const pin = await this.pinsRepo.findOne({where: { id: likeDto.pinId}})
         if (!pin) throw new NotFoundException("Pin no encontrado");

        const existingLike = await this.likeRepo.findOne({
        where: {pin: {id: likeDto.pinId}, user: {id: id}},
        });
        if (existingLike) return{message:"Ya diste like a esta publicación."};

        const like = await this.likeRepo.create({pin, user: {id: id}}) 
        return await this.likeRepo.save(like);

    }



    async deleteLike(id: string): Promise<Like> {
        const remove = await this.likeRepo.findOne({where: {id: id}})
        
        if(!remove) throw new NotFoundException("Esta publicación no fue encontrada.")

        return await this.likeRepo.remove(remove)    
    
    }

    async createComment(userId: string, pinId:string , comment: CommentDto): Promise<{
    user: User;
    post: Pin;
    comment: string;
    date: Date;
    }> {
        
        
        const pin = await this.pinsRepo.findOne({where: {id: pinId}})
        if(!pin) throw new NotFoundException("La publicación no se encontro.")
        
        const user = await this.userRepo.findOne({where: {id: userId}})
        if(!user) throw new NotFoundException("La publicación no se encontro.")
        
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
        if(!commentId) throw new NotFoundException("No se encontro el comentario.")
            
            
        const modifiComment = this.commentRepo.merge(commentId, comment)
        return await this.commentRepo.save(modifiComment)
    
    }


    async deleteComment(id: string): Promise<Comment> {
        const commentId = await this.commentRepo.findOne({where: {id: id}}) 
        if(!commentId) throw new NotFoundException("No se encontro el comentario.")

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
