import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemTable1696857475087 implements MigrationInterface {
    name = 'AddItemTable1696857475087';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "user_items_item" ("userId" uuid NOT NULL, "itemId" uuid NOT NULL, CONSTRAINT "PK_5a053edc1d018fd9992815a57f1" PRIMARY KEY ("userId", "itemId"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_2abc55126b5485a1ed048fba6c" ON "user_items_item" ("userId") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_e68a77b76d428ff26adcbf05b8" ON "user_items_item" ("itemId") `,
        );
        await queryRunner.query(`ALTER TABLE "offer" ADD "itemId" uuid`);
        await queryRunner.query(
            `ALTER TABLE "offer" ADD CONSTRAINT "UQ_40199af67b763fc3ecc5a0d44e0" UNIQUE ("itemId")`,
        );
        await queryRunner.query(
            `ALTER TABLE "offer" ADD CONSTRAINT "FK_40199af67b763fc3ecc5a0d44e0" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_items_item" ADD CONSTRAINT "FK_2abc55126b5485a1ed048fba6cc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_items_item" ADD CONSTRAINT "FK_e68a77b76d428ff26adcbf05b8d" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_items_item" DROP CONSTRAINT "FK_e68a77b76d428ff26adcbf05b8d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_items_item" DROP CONSTRAINT "FK_2abc55126b5485a1ed048fba6cc"`,
        );
        await queryRunner.query(
            `ALTER TABLE "offer" DROP CONSTRAINT "FK_40199af67b763fc3ecc5a0d44e0"`,
        );
        await queryRunner.query(
            `ALTER TABLE "offer" DROP CONSTRAINT "UQ_40199af67b763fc3ecc5a0d44e0"`,
        );
        await queryRunner.query(`ALTER TABLE "offer" DROP COLUMN "itemId"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_e68a77b76d428ff26adcbf05b8"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_2abc55126b5485a1ed048fba6c"`,
        );
        await queryRunner.query(`DROP TABLE "user_items_item"`);
        await queryRunner.query(`DROP TABLE "item"`);
    }
}
