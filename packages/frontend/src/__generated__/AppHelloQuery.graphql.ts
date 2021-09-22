/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';

export type AppHelloQueryVariables = {};
export type AppHelloQueryResponse = {
    readonly hello: {
        readonly message: string;
        readonly success: boolean;
        readonly errors: ReadonlyArray<string | null>;
    } | null;
};
export type AppHelloQuery = {
    readonly response: AppHelloQueryResponse;
    readonly variables: AppHelloQueryVariables;
};

/*
query AppHelloQuery {
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
            name: 'AppHelloQuery',
            selections: v0 /*: any*/,
            type: 'Query',
            abstractKey: null,
        },
        kind: 'Request',
        operation: {
            argumentDefinitions: [],
            kind: 'Operation',
            name: 'AppHelloQuery',
            selections: v0 /*: any*/,
        },
        params: {
            cacheID: '2a82eb1d752180887ba3d5229b6b6932',
            id: null,
            metadata: {},
            name: 'AppHelloQuery',
            operationKind: 'query',
            text: 'query AppHelloQuery {\n  hello {\n    message\n    success\n    errors\n  }\n}\n',
        },
    } as any;
})();
(node as any).hash = '96fe8bcbe6e60ff9f0f90cf791d73a20';
export default node;
