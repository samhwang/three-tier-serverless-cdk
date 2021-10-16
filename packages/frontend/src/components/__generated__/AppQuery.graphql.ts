/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';

export type AppQueryVariables = {};
export type AppQueryResponse = {
    readonly hello: {
        readonly message: string;
        readonly success: boolean;
        readonly errors: ReadonlyArray<string | null>;
    } | null;
};
export type AppQuery = {
    readonly response: AppQueryResponse;
    readonly variables: AppQueryVariables;
};

/*
query AppQuery {
  hello {
    message
    success
    errors
  }
}
*/

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
        } as any,
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
    } as any;
})();
(node as any).hash = '2dd2d9e557f2ed3f922f76fbdbed7d08';
export default node;
