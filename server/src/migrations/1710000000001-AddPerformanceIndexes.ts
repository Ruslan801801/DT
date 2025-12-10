import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPerformanceIndexes1710000000001 implements MigrationInterface {
name = 'AddPerformanceIndexes1710000000001'
public async up(queryRunner: QueryRunner): Promise<void> {
await queryRunner.query(`
CREATE INDEX IF NOT EXISTS "IDX_vouchers_active_expires"
ON "vouchers" ("expires_at")
WHERE state NOT IN ('redeemed', 'revoked')
`);
await queryRunner.query(`
CREATE INDEX IF NOT EXISTS "IDX_transactions_created"
ON "transactions" ("created_at")
`);
await queryRunner.query(`
CREATE INDEX IF NOT EXISTS "IDX_transactions_user_recent"
ON "transactions" ("sender_id", "created_at")
`);
await queryRunner.query(`
CREATE INDEX IF NOT EXISTS "IDX_voucher_events_voucher_created"
ON "voucher_events" ("voucher_id", "created_at")
`);
}
public async down(queryRunner: QueryRunner): Promise<void> {
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_voucher_events_voucher_created"`);
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_transactions_user_recent"`);
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_transactions_created"`);
await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vouchers_active_expires"`);
}
}