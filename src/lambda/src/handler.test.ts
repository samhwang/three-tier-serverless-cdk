import { handler } from './handler';

it('Should return correct response', async () => {
  const expected = {
    statusCode: 200,
    body: 'Hello World!',
  };
  const output = await handler();
  expect(output).toEqual(expected);
});
