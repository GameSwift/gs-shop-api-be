import { ApiProperty } from '@nestjs/swagger';
import { Item } from '../entities/item.entity';

class OwnedItemResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    constructor(item: Item) {
        this.id = item.id;
        this.name = item.name;
    }
}

export class ItemsGetOwnedItemsResponse {
    @ApiProperty({
        type: [OwnedItemResponse],
    })
    items: Array<OwnedItemResponse>;

    constructor(items: Item[]) {
        this.items = items.map((item) => new OwnedItemResponse(item));
    }
}
