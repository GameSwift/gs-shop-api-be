import { ConflictException, Injectable } from '@nestjs/common';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private itemsRepository: Repository<Item>,
    ) {}

    async validateItemOwnership(userId: string, itemId: string) {
        const existingItem = await this.itemsRepository.find({
            where: { id: itemId, users: { id: userId } },
            relations: { users: true },
        });

        return !!existingItem;
    }

    async assignToUser(userId: string, itemId: string) {
        const existingItem = await this.itemsRepository.find({
            where: { id: itemId, users: { id: userId } },
            relations: { users: true },
        });

        if (existingItem) {
            throw new ConflictException('User already owns this item');
        }

        await this.itemsRepository
            .createQueryBuilder()
            .relation(Item, 'users')
            .of(itemId)
            .add(userId);
    }

    async getOwnedItems(id: string) {
        const items = await this.itemsRepository.find({
            where: { users: { id: id } },
            relations: { users: true },
        });

        return items;
    }
}
