import { handler } from './handler';

it('Should return correct response', () => {
  const expected = {
    statusCode: 200,
    body: 'Hello World!',
  };
  const output = handler();
  expect(output).toEqual(expected);
});
