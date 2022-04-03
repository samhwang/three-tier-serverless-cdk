/**
 * @generated SignedSource<<1942e0b27bab239eb647b3883b7a9d5d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AppQuery$variables = {};
export type AppQuery$data = {
  readonly hello: {
    readonly message: string;
    readonly success: boolean;
    readonly errors: ReadonlyArray<string | null>;
  } | null;
};
export type AppQuery = {
  variables: AppQuery$variables;
  response: AppQuery$data;
};

const node: ConcreteRequest = (function () {
  var v0 = [
    {
      alias: null,
      args: null,
      concreteType: 'HelloType',
      kind: 'LinkedField',
      name: 'hello',
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'message',
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'success',
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: 'ScalarField',
          name: 'errors',
          storageKey: null,
        },
      ],
      storageKey: null,
    },
  ];
  return {
    fragment: {
      argumentDefinitions: [],
      kind: 'Fragment',
      metadata: null,
      name: 'AppQuery',
      selections: v0 /*: any*/,
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: [],
      kind: 'Operation',
      name: 'AppQuery',
      selections: v0 /*: any*/,
    },
    params: {
      cacheID: '638d8026ca91c847649cc275db37a20f',
      id: null,
      metadata: {},
      name: 'AppQuery',
      operationKind: 'query',
      text: 'query AppQuery {\n  hello {\n    message\n    success\n    errors\n  }\n}\n',
    },
  };
})();

(node as any).hash = '2dd2d9e557f2ed3f922f76fbdbed7d08';

export default node;
