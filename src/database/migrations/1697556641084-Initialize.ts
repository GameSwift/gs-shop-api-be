import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialize1697556641084 implements MigrationInterface {
    name = 'Initialize1697556641084';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "oauth_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hashedAccessToken" character varying NOT NULL, "userId" uuid NOT NULL, "expireAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_7e6a25a3cc4395d1658f5b89c73" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nickname" citext NOT NULL, "email" citext NOT NULL, "gameSwiftID" character varying NOT NULL, CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, "offerId" uuid NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "offer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "price" integer NOT NULL, "description" character varying NOT NULL, "itemId" uuid NOT NULL, CONSTRAINT "REL_40199af67b763fc3ecc5a0d44e" UNIQUE ("itemId"), CONSTRAINT "PK_57c6ae1abe49201919ef68de900" PRIMARY KEY ("id"))`,
        );
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
        await queryRunner.query(
            `ALTER TABLE "oauth_token" ADD CONSTRAINT "FK_f6b4b1ac66b753feab5d831ba04" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "FK_a536e1a65e8d9bf3f5a4cddc3ee" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
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
            `ALTER TABLE "order" DROP CONSTRAINT "FK_a536e1a65e8d9bf3f5a4cddc3ee"`,
        );
        await queryRunner.query(
            `ALTER TABLE "oauth_token" DROP CONSTRAINT "FK_f6b4b1ac66b753feab5d831ba04"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_e68a77b76d428ff26adcbf05b8"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_2abc55126b5485a1ed048fba6c"`,
        );
        await queryRunner.query(`DROP TABLE "user_items_item"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "offer"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "oauth_token"`);
    }
}
