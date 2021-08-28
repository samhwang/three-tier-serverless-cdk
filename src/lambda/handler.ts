export const handler = (event?: any, context?: any) => {
  console.log({ event, context });
  return {
    statusCode: 200,
    body: 'Hello World!',
  };
};
