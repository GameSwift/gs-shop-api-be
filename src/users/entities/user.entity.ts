import { Column, Entity, JoinTable, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { OauthToken } from '../../oauth/entities/oauth.token.entity';

@Entity()
export class User extends BaseEntity {
    @Column({ unique: true, type: 'citext' })
    nickname: string;

    @Column({ unique: true, type: 'citext' })
    email: string;

    @Column()
    gameSwiftID: string;

    @OneToMany(() => OauthToken, (oauthToken) => oauthToken.user)
    @JoinTable()
    oauthTokens: Array<OauthToken>;
}
