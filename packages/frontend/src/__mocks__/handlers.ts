import { graphql } from 'msw';

export const handlers = [
  graphql.query('AppQuery', (_, res, ctx) =>
    res(
      ctx.data({
        hello: {
          message: 'Hello World',
          success: true,
          errors: [],
        },
      })
    )
  ),
];
