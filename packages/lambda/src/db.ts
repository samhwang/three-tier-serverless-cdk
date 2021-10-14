import { PrismaClient } from '@prisma/client';
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const sm = new SecretsManager({ region: process.env.REGION });
let db: PrismaClient;

export const getDb = async () => {
    if (db) {
        return db;
    }

    const dbUrl = await sm.getSecretValue({
        SecretId: process.env.SECRET_ID || '',
    });

    const secretString = JSON.parse(dbUrl.SecretString || '{}');
    const url = `postgresql://${secretString.username}:${secretString.password}@${secretString.host}:${secretString.port}/${secretString.dbname}?connection_limit=1`;

    db = new PrismaClient({
        datasources: { db: { url } },
    });

    return db;
};
