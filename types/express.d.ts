import { AuthenticatedUser } from "src/common/interfaces/user.interface"



declare module "express-serve-static-core" {
    interface Request {
        user?: AuthenticatedUser;
        logout(callback: (err: any) => void):void;
        login(user: AuthenticatedUser, callback: (err: any) => void):void;
    }

}