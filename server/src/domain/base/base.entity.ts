import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id?: string;

    @Column({ nullable: true })
    createdBy?: string;

    @CreateDateColumn()
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdDate?: Date;

    @Column({ nullable: true })
    lastModifiedBy?: string;

    @UpdateDateColumn()
    @Column({ nullable: true })
    lastModifiedDate?: Date;
}
