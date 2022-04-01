import { Handler } from 'aws-lambda';
import { execFile } from 'child_process';
import path from 'path';

type PrismaCommand = 'deploy' | 'reset';

export const handler: Handler = async (event) => {
    /**
     * Available commands:
     * - deploy: Create new db if not exist, and apply all migrations
     * - reset:  Delete the existing db, create a new one, and apply all migrations. NOT for production.
     */
    const command: PrismaCommand = event.command ?? 'deploy';

    let options: string[] = [];

    if (command === 'reset') {
        options = ['--force', '--skip-generate'];
    }

    try {
        const exitCode = await new Promise((resolve) => {
            execFile(
                path.resolve(
                    __dirname,
                    'node_modules',
                    'prisma',
                    'build',
                    'index.js'
                ),
                ['migrate', command, ...options],
                (execError, stdout, stderr) => {
                    console.log(stdout);
                    if (!execError) {
                        console.error(
                            `prisma migrate ${command} failed with the following error: ${
                                execError!.message
                            }. Stderr: ${stderr}`
                        );
                        resolve(execError!.code ?? 1);
                    }

                    resolve(0);
                }
            );
        });

        if (exitCode !== 0) {
            throw new Error(
                `Command ${command} failed with exit code ${exitCode}`
            );
        }
    } catch (error: any) {
        console.error(error);
        throw error;
    }
};
