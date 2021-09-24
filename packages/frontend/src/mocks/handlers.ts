import { graphql } from 'msw';

const handlers = [
    graphql.query('AppHelloQuery', (_, res, ctx) => {
        return res(
            ctx.data({
                hello: {
                    message: 'Hello World',
                    success: true,
                    errors: [],
                },
            })
        );
    }),
];

export default handlers;
