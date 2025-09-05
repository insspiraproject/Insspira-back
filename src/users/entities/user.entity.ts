import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { v4 as uuid} from "uuid";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string = uuid();

    @Column({ unique: true, nullable: true })
    auth0Id: string;

    @Column({length: 50})
    username: string;

    @Column({ length:50, unique: true })
    email: string;

    @Column({type:"bigint", nullable: true})
    phone: string;

    @Column()
    birthdate: Date;

    @Column({ nullable: true }) 
    password: string;

    @Column({ default: false }) 
    isAdmin: boolean;
}