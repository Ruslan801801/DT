import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1710000000000 implements MigrationInterface {
name = 'InitSchema1710000000000'

public async up(queryRunner: QueryRunner): Promise<void> {
await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "phone" character varying(255) NOT NULL, "display_name" character varying(255), "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "UQ_users_phone" UNIQUE ("phone"), CONSTRAINT "PK_users_id" PRIMARY KEY ("id"))`);
await queryRunner.query(`CREATE INDEX "IDX_users_phone" ON "users" ("phone")`);

await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "sender_id" character varying(255) NOT NULL, "receiver_eid" character varying(255) NOT NULL, "amount" numeric(14,2) NOT NULL, "currency" character varying(32) NOT NULL, "idempotency_key" character varying(128) NOT NULL, "status" character varying(32) NOT NULL DEFAULT 'pending', "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "UQ_tx_idemp" UNIQUE ("idempotency_key"), CONSTRAINT "PK_tx_id" PRIMARY KEY ("id"))`);
await queryRunner.query(`CREATE INDEX "IDX_tx_sender" ON "transactions" ("sender_id")`);
await queryRunner.query(`CREATE INDEX "IDX_tx_receiver_eid" ON "transactions" ("receiver_eid")`);

await queryRunner.query(`CREATE TABLE "vouchers" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "issuer_id" character varying(255) NOT NULL, "receiver_eid" character varying(255) NOT NULL, "amount" numeric(14,2) NOT NULL, "expires_at" TIMESTAMPTZ, "state" character varying(32) NOT NULL DEFAULT 'issued', "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_vouchers_id" PRIMARY KEY ("id"))`);
await queryRunner.query(`CREATE INDEX "IDX_voucher_issuer" ON "vouchers" ("issuer_id")`);
await queryRunner.query(`CREATE INDEX "IDX_voucher_receiver" ON "vouchers" ("receiver_eid")`);
await queryRunner.query(`CREATE INDEX "IDX_voucher_state" ON "vouchers" ("state")`);

await queryRunner.query(`CREATE TABLE "voucher_events" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "voucher_id" uuid NOT NULL, "type" character varying(64) NOT NULL, "data" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_voucher_events_id" PRIMARY KEY ("id"))`);
await queryRunner.query(`CREATE INDEX "IDX_voucher_event_vid" ON "voucher_events" ("voucher_id")`);
await queryRunner.query(`CREATE INDEX "IDX_voucher_event_type" ON "voucher_events" ("type")`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
await queryRunner.query(`DROP INDEX "IDX_voucher_event_type"`);
await queryRunner.query(`DROP INDEX "IDX_voucher_event_vid"`);
await queryRunner.query(`DROP TABLE "voucher_events"`);

await queryRunner.query(`DROP INDEX "IDX_voucher_state"`);
await queryRunner.query(`DROP INDEX "IDX_voucher_receiver"`);
await queryRunner.query(`DROP INDEX "IDX_voucher_issuer"`);
await queryRunner.query(`DROP TABLE "vouchers"`);

await queryRunner.query(`DROP INDEX "IDX_tx_receiver_eid"`);
await queryRunner.query(`DROP INDEX "IDX_tx_sender"`);
await queryRunner.query(`DROP TABLE "transactions"`);

await queryRunner.query(`DROP INDEX "IDX_users_phone"`);
await queryRunner.query(`DROP TABLE "users"`);
}

}