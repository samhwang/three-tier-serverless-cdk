import { queryType, objectType, list, nonNull } from 'nexus';

const HelloType = objectType({
  name: 'HelloType',
  definition(t) {
    t.field('message', {
      type: nonNull('String'),
    });
    t.field('success', {
      type: nonNull('Boolean'),
    });
    t.field('errors', {
      type: nonNull(list('String')),
    });
  },
});

export const Query = queryType({
  definition(t) {
    t.field('hello', {
      type: HelloType,
      resolve: () => ({
        message: 'Hello World',
        success: true,
        errors: [],
      }),
    });
  },
});
