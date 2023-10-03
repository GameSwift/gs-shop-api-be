import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OffersService {
    constructor(
        @InjectRepository(Offer)
        private offersRepository: Repository<Offer>,
    ) {}

    findAll() {
        return this.offersRepository.find();
    }

    findOne(id: number) {
        return `This action returns a #${id} offer`;
    }

    remove(id: number) {
        return `This action removes a #${id} offer`;
    }
}
