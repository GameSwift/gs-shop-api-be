import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialize1695808197859 implements MigrationInterface {
    name = 'Initialize1695808197859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "nickname" citext NOT NULL, "email" citext NOT NULL, "gameSwiftID" character varying NOT NULL, CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "oauth_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hashedAccessToken" character varying NOT NULL, "userId" uuid NOT NULL, "expireAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_7e6a25a3cc4395d1658f5b89c73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "oauth_token" ADD CONSTRAINT "FK_f6b4b1ac66b753feab5d831ba04" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "oauth_token" DROP CONSTRAINT "FK_f6b4b1ac66b753feab5d831ba04"`);
        await queryRunner.query(`DROP TABLE "oauth_token"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
