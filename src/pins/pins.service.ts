import { Injectable, NotFoundException } from "@nestjs/common";
import { PinsRepository } from "./pins.repository";
import { pinsDto } from "./pinsDtos/createPins.dto";
import { CreateLikeDto } from "./pinsDtos/likePins.dto";
import { CommentDto} from "./pinsDtos/commentPins.dto";


@Injectable()


export class PinsService {
    
    
    constructor(private readonly repository: PinsRepository){}

    
    async getPinsService() {
        return await this.repository.getPins()
    }
    
    async getPinsIdService(id: string) {
        return this.repository.pinsId(id)
    }

    async putPinsService(dtoPin:pinsDto, id: string) {
       return await this.repository.modifiPins(dtoPin, id)
    }

    async postPinsService(dtoPin: pinsDto) {
        return await this.repository.createPins(dtoPin)
    }

    async deletePinsService(id: string) {
        return await this.repository.deletePins(id)
    }


    async likeService(likeDto: CreateLikeDto, id: string) {
        return await this.repository.createLike(likeDto,id)
        
    }

    async likeDeleteService(id: string) {
        return await this.repository.deleteLike(id)        
    }

    async commentService(userId: string, pinId:string , comment: CommentDto) {
        return await this.repository.createComment(userId, pinId, comment)
    }


    async commentModifieService(id:string, comment: CommentDto) {
        return await this.repository.modifieComment(id, comment)
    }
    

    async commentDeleteService(id: string) {
        return await this.repository.deleteComment(id)
    }
    

}