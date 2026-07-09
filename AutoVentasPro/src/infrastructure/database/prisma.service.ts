import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma/client.js';

let prisma: PrismaClient;

export function getPrisma(): PrismaClient {
    if (!prisma) {
        const pool = new pg.Pool({
            host: process.env['DB_HOST'],
            port: Number(process.env['DB_PORT']),
            database: process.env['DB_NAME'],
            user: process.env['DB_USER'],
            password: process.env['DB_PASSWORD'],
        });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
}

export async function disconnectPrisma(): Promise<void> {
    if (prisma) {
        await prisma.$disconnect();
    }
}
