import { extendType, inputObjectType } from 'nexus';
import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay';
import { User } from 'nexus-prisma';
import { Context } from '../context';

export const AllUsersConnectionWhere = inputObjectType({
    name: 'AllUsersConnectionWhere',
    definition: (t) => {
        t.boolean('activated');
    },
});

export const AllUsersConnectionQuery = extendType({
    type: 'Query',
    definition: (t) => {
        t.nonNull.connectionField('allUsers', {
            type: User.$name,
            additionalArgs: {
                where: AllUsersConnectionWhere,
            },
            resolve: async (
                _root: any,
                { where, after, first }: any,
                { prisma }: Context
            ) => {
                const offset = after ? cursorToOffset(after) + 1 : 0;
                if (Number.isNaN(offset)) {
                    throw new Error('Invalid Cursor');
                }

                const filters = {
                    activated: where?.activated ?? undefined,
                };

                const [totalCount, items] = await Promise.all([
                    prisma.user.count({
                        where: filters,
                    }),
                    prisma.user.findMany({
                        where: filters,
                        take: first,
                        skip: offset,
                    }),
                ]);

                return connectionFromArraySlice(
                    items,
                    { first, after },
                    { sliceStart: offset, arrayLength: totalCount }
                );
            },
        });
    },
});
