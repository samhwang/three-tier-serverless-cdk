import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

export const getDb = async () => {
    if (db) {
        return db;
    }

    const dbSecret = process.env.DB_SECRET || '{}';

    const parsedSecret = JSON.parse(dbSecret);
    const url = `postgresql://${parsedSecret.username}:${parsedSecret.password}@${parsedSecret.host}:${parsedSecret.port}/${parsedSecret.dbname}?connection_limit=1`;

    db = new PrismaClient({
        datasources: { db: { url } },
    });

    return db;
};
