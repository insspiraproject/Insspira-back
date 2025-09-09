import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pin } from "./pins.entity";





@Entity({ name: "hashtags" })

export class Hashtag {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  tag: string; 

  @ManyToMany(() => Pin, (pin) => pin.hashtags)
  pins: Pin[];
}