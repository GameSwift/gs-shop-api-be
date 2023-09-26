import { Injectable } from '@nestjs/common';

@Injectable()
export class OffersService {
    findAll() {
        return `This action returns all offers`;
    }

    findOne(id: number) {
        return `This action returns a #${id} offer`;
    }

    remove(id: number) {
        return `This action removes a #${id} offer`;
    }
}
