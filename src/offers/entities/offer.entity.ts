import { Column } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

export class Offer extends BaseEntity {
    @Column()
    price: number;

    @Column()
    description: string;
}
