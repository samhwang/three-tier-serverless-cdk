import { objectType } from 'nexus';
import { User } from 'nexus-prisma';

export const UserModel = objectType({
  name: User.$name,
  definition: (t) => {
    t.implements('Node');
    t.field(User.username);
    t.field(User.password);
    t.field(User.createdAt);
    t.field(User.activated);
  },
});
