import { SetMetadata } from "@nestjs/common";
import { ActionType } from "src/pins.enum";



export const CHECK_LIMIT_KEY = 'checkLimit';

export const CheckLimit = (action: ActionType) => SetMetadata(CHECK_LIMIT_KEY, action)
