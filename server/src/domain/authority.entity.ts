import { Entity, PrimaryColumn } from 'typeorm';


@Entity('authority')
export class Authority {
    @PrimaryColumn()
    name: string;
}
