import { queryType, objectType, list, nonNull } from 'nexus';
import { hello } from '../resolver/hello';

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

const Query = queryType({
    definition(t) {
        t.field('hello', {
            type: HelloType,
            resolve: hello,
        });
    },
});

export default Query;
