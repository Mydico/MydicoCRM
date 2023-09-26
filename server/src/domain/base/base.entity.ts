import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id?: string;

    @Column({ nullable: true })
    @Index()
    createdBy?: string;

    @CreateDateColumn({ precision: 6 /* or any other */, default: () => "CURRENT_TIMESTAMP" })
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    @Index()
    createdDate?: Date;

    @Column({ nullable: true })
    @Index()
    lastModifiedBy?: string;

    @UpdateDateColumn()
    @Column({ nullable: true })
    @Index()
    lastModifiedDate?: Date;
}
