import { CallHandler, ExecutionContext, ForbiddenException, NestInterceptor } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { from, lastValueFrom, mergeMap, Observable } from "rxjs";
import { ActionType } from "src/pins.enum";
import { SubStatus } from "src/status.enum";
import { Sub } from "src/subscriptions/subscription.entity";
import { In, Repository } from "typeorm";



export class LimitInterceptor implements NestInterceptor {
    
    constructor(
    @InjectRepository(Sub)
    private readonly subRepo: Repository<Sub>,
    ) {}


intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {  
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const action: ActionType = req.action;
    const sub = req.subscription;

    return from(
        ( async()=>{

        const activate = sub ?? await this.subRepo.findOne({

        where: { user: { id: user.sub }, status: In([SubStatus.ENABLED, SubStatus.ACTIVE]) }
        });
        if(!activate) throw new ForbiddenException("You don't have any subscription")

            if(activate.status === SubStatus.ENABLED){

                switch (action) {
                    case ActionType.POST:
                        if (activate.dailyPosts >= 3) {
                            throw new ForbiddenException('You have reached the daily limit of 3 posts with the free plan');
                        }
                        activate.dailyPosts++
                        break;
                        
                        case ActionType.LIKE:
                            if (activate.dailyLikes >= 5) {
                                throw new ForbiddenException('You have reached the daily limit of 5 likes with the free plan');
                            }
                            activate.dailyLikes++;
                            
                            break;
                            
                            case ActionType.SAVE:
                                if (activate.dailySaves >= 2) {
                                    throw new ForbiddenException('You have reached the daily limit of 2 saves with the free plan');
                                }
                                activate.dailySaves++;
                                
                                break;
                                
                                case ActionType.COMMENT:
                                    if (activate.dailyComments >= 3) {
                                        throw new ForbiddenException('You have reached the daily limit of 3 comments with the free plan');
                                    }
                                    activate.dailyComments++;
                                    
                                    break;
                                }
                                
                            }
                                await this.subRepo.save(activate);
                            })()).pipe(
                                mergeMap(()=> next.handle())
                            )
                        }
                    }
