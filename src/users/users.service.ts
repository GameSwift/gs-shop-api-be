import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalTokenInfoData } from '../oauth/oauth.api.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async updateTokenData(userId: string, tokenInfo: ExternalTokenInfoData) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }

        if (tokenInfo.nickname) {
            user.nickname = tokenInfo.nickname;
        }

        if (tokenInfo.email) {
            user.email = tokenInfo.email;
        }

        return this.userRepository.save(user);
    }

    async initialize(tokenInfo: ExternalTokenInfoData): Promise<User | null> {
        const user = this.userRepository.create({
            gameSwiftID: tokenInfo.userId,
            nickname: tokenInfo.nickname,
            email: tokenInfo.email,
        });

        const savedUser = await this.userRepository.save(user);

        return this.userRepository.save(savedUser);
    }

    findOneByGSId(id: string): Promise<User | null> {
        return this.userRepository.findOneBy({
            gameSwiftID: id,
        });
    }

    findOneById(id: string, includeRelations = false): Promise<User | null> {
        if (includeRelations) {
            return this.userRepository.findOne({
                where: { id },
            });
        }

        return this.userRepository.findOneBy({
            id: id,
        });
    }
}
