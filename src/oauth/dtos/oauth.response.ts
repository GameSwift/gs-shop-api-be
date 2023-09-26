import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class OauthGetMeResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    nickname: string;

    @ApiProperty()
    email: string;

    @ApiProperty({
        type: String,
        nullable: true,
    })
    avatarUrl: string | null;

    @ApiProperty({
        type: String,
        nullable: true,
    })
    country: string | null;

    @ApiProperty()
    ranking: number;

    constructor(user: User) {
        this.id = user.id;
        this.nickname = user.nickname;
        this.email = user.email;
        this.avatarUrl = user.avatarUrl || null;
        this.country = user.country || null;
    }
}
