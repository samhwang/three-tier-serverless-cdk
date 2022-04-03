import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const region = process.env.REGION || 'ap-southeast-2';
const stage = process.env.STAGE || 'dev';

async function invokeMigrateFunction() {
  const client = new LambdaClient({
    region,
  });
  const command = new InvokeCommand({
    FunctionName: `app-migration-runner-${stage}`,
    Payload: Buffer.from(
      JSON.stringify({
        command: 'deploy',
      })
    ),
  });

  try {
    await client.send(command);
  } catch (error) {
    console.error(error);
  }
}

invokeMigrateFunction();
