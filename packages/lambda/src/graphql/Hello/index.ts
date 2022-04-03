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

const hello = () => ({
  message: 'Hello World',
  success: true,
  errors: [],
});

const Hello = queryType({
  definition(t) {
    t.field('hello', {
      type: HelloType,
      resolve: hello,
    });
  },
});

export default Hello;
