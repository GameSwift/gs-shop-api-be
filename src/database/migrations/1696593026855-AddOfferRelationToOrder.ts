import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOfferRelationToOrder1696593026855
    implements MigrationInterface
{
    name = 'AddOfferRelationToOrder1696593026855';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "offer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "price" integer NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_57c6ae1abe49201919ef68de900" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, "offerId" uuid NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "FK_a536e1a65e8d9bf3f5a4cddc3ee" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" DROP CONSTRAINT "FK_a536e1a65e8d9bf3f5a4cddc3ee"`,
        );
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "offer"`);
    }
}
