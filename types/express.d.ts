import { User } from "src/common/interfaces/user.interface"



declare module "express-serve-static-core" {
    interface Request {
        user?: User
        logout(callback: (err: any) => void):void;
        login(user: User, callback: (err: any) => void):void;
    }

}