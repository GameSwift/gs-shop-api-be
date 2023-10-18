import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';
import { encryptSHA256 } from '../../utils/crypto.helpers';

@Entity()
export class OauthToken extends BaseEntity {
    @Column({ nullable: false })
    hashedAccessToken: string;

    @ManyToOne(() => User)
    user: User;

    @Column()
    userId: string;

    @Column()
    expireAt: Date;

    accessToken: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashAccessToken() {
        this.hashedAccessToken = encryptSHA256(this.accessToken, this.userId);
    }
}
