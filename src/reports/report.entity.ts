import { ReportStatus, ReportTarget, ReportType } from "src/report.enum";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity({
    name: "reports"
})



export class Report {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => User, (user)=> user.reports)
    user: User

    @Column({
    type: "enum",
    enum: ReportTarget,
    default: ReportTarget.NONE,
    })
    targetType: ReportTarget;

    @Column({type: "uuid"})
    targetId: string

    @Column({ type: "text", nullable: true })
    reason: string;

    @Column({
    type: "enum",
    enum: ReportType,
    default: ReportType.OTHER,
    })
    type: ReportType;

    @Column({
    type: "enum",
    enum: ReportStatus,
    default: ReportStatus.PENDING,
    })
    status: ReportStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}