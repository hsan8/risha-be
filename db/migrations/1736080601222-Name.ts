import { MigrationInterface, QueryRunner } from "typeorm";

export class Name1736080601222 implements MigrationInterface {
    name = 'Name1736080601222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP CONSTRAINT "FK_12c7f0f643f71dd3a48017f0c7a"`);
        await queryRunner.query(`DROP INDEX "public"."charge_ids"`);
        await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "charge_ids" TO "charge_id"`);
        await queryRunner.query(`ALTER TABLE "payments" RENAME CONSTRAINT "UQ_c77af4cc8504656956d6dee026a" TO "UQ_530e4ff65de610227bed7a305d6"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP COLUMN "short_link"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP COLUMN "is_expired"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP COLUMN "expiry_date"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP COLUMN "expiry_duration"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP COLUMN "time_zone"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP CONSTRAINT "REL_12c7f0f643f71dd3a48017f0c7"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP COLUMN "payment_id"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD "mid" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD "method" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD "expiryDate" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD "reference_id" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD CONSTRAINT "UQ_e695eb7f2aefa01c83dd5b24139" UNIQUE ("reference_id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "charge_id" ON "payments" ("charge_id") `);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD CONSTRAINT "FK_e695eb7f2aefa01c83dd5b24139" FOREIGN KEY ("reference_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP CONSTRAINT "FK_e695eb7f2aefa01c83dd5b24139"`);
        await queryRunner.query(`DROP INDEX "public"."charge_id"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP CONSTRAINT "UQ_e695eb7f2aefa01c83dd5b24139"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP COLUMN "reference_id"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP COLUMN "expiryDate"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP COLUMN "method"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" DROP COLUMN "mid"`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD "payment_id" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD CONSTRAINT "REL_12c7f0f643f71dd3a48017f0c7" UNIQUE ("payment_id")`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD "time_zone" text NOT NULL DEFAULT 'Asia/Kuwait'`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD "expiry_duration" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD "expiry_date" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD "is_expired" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD "short_link" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" RENAME CONSTRAINT "UQ_530e4ff65de610227bed7a305d6" TO "UQ_c77af4cc8504656956d6dee026a"`);
        await queryRunner.query(`ALTER TABLE "payments" RENAME COLUMN "charge_id" TO "charge_ids"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "charge_ids" ON "payments" ("charge_ids") `);
        await queryRunner.query(`ALTER TABLE "payment_short_links" ADD CONSTRAINT "FK_12c7f0f643f71dd3a48017f0c7a" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
