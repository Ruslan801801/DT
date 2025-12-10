import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Transaction } from './entities/Transaction';
import { Voucher } from './entities/Voucher';
import { VoucherEvent } from './entities/VoucherEvent';

const url = process.env.DATABASE_URL || 'postgres://deeptea:deeptea@localhost:5432/deeptea';

export const AppDataSource = new DataSource({
type: 'postgres',
url,
entities: [User, Transaction, Voucher, VoucherEvent],
migrations: ['src/migrations/*.ts'],
synchronize: false,
logging: false,
});

export default AppDataSource;