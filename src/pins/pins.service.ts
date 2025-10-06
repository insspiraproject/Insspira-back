// src/pins/pins.service.ts
import { Injectable } from "@nestjs/common";
import { PinsRepository } from "./pins.repository";
import { pinsDto, updateDto } from "./pinsDtos/pins.dto";
import { CommentDto} from "./pinsDtos/comments.dto";

@Injectable()

export class PinsService {
    
    constructor(private readonly repository: PinsRepository){}

    // Query 
    async serviceSearch(query: string) {
        return await this.repository.createSearch(query)
    }

    // PINS 
    async getPinsService(page: number, limit: number) {
        
        return await this.repository.getPins(page, limit)
    }
    
    async getPinsIdService(id: string) {
        return this.repository.pinsId(id)
    }

    async putPinsService(userId: string, dtoPin:updateDto, pinsId: string, hashtags: { id: string; tag: string }[]) {
        return await this.repository.modifiPins(userId, dtoPin, pinsId, hashtags)
    }

    async postPinsService(dtoPin: pinsDto, idUser:string) {
        return await this.repository.createPins(dtoPin, idUser)
    }

    async deletePinsService(id: string, userId: string) {
        return await this.repository.deletePins(id, userId)
    }

    // Like PINS

    async likeService(idPin:string, idUser: string) {
        return await this.repository.createLike(idPin, idUser)
        
    }

    async likeView(userId: any, pinId: string) {
       return await this.repository.likeStatus(pinId, userId)
    }
    


    // Comment PINS

    async commentViewService( pinId: string) {
         return await this.repository.viewComment( pinId)
    }

    async commentService(userId: string, pinId:string , comment: CommentDto) {
        return await this.repository.createComment(userId, pinId, comment)
    }


    async commentModifieService(id:string, comment: CommentDto, userId:string) {
        return await this.repository.modifieComment(id, comment, userId)
    }
    

    async commentDeleteService(id: string, userId: string) {
        return await this.repository.deleteComment(id, userId)
    }

    // View PINS

    async viewService(idUser: string, idPins: string) {
        return await this.repository.createView(idUser, idPins)
    }

    // Save PINS

    async getSaveService(idUser:string) {
        return this.repository.createGetSave( idUser)
    }

    async saveService(idPins: string, idUser: string) {
        return await this.repository.createSave(idPins, idUser)
    }

    async deleteSave(id: string, idUser: string) {
        return await this.repository.createDeleteSave(id, idUser)
    }

    async getPinsByUserService(userId: string, page?: number, limit?: number): Promise<any> {
        return await this.repository.getPinsByUser(userId, page || 1, limit || 20);
    }
    
    // Obtener pins que un usuario ha dado like
    async getLikedPinsService(userId: string, page?: number, limit?: number): Promise<any> {
        return await this.repository.getLikedPins(userId, page || 1, limit || 20);
    }

    async getUserPinsCountService(userId: string): Promise<number> {
        return await this.repository.getUserPinsCount(userId);
    }

}