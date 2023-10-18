import { Column, Entity, ManyToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Item extends BaseEntity {
    @Column()
    name: string;

    @OneToOne(() => Offer, {
        cascade: true,
        nullable: true,
    })
    offer?: Offer;

    @ManyToMany(() => User, (user) => user.items)
    users: Array<User>;
}
