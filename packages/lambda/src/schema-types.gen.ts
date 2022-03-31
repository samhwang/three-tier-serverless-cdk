/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type { Context } from './graphql/context/index';
import type { core, connectionPluginCore } from 'nexus';
declare global {
    interface NexusGenCustomInputMethods<TypeName extends string> {
        /**
         * The `BigInt` scalar type represents non-fractional signed whole numeric values.
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
         */
        bigInt<FieldName extends string>(
            fieldName: FieldName,
            opts?: core.CommonInputFieldConfig<TypeName, FieldName>
        ): void; // "BigInt";
        /**
         * The `Byte` scalar type represents byte value as a Buffer
         */
        bytes<FieldName extends string>(
            fieldName: FieldName,
            opts?: core.CommonInputFieldConfig<TypeName, FieldName>
        ): void; // "Bytes";
        /**
         * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
         */
        dateTime<FieldName extends string>(
            fieldName: FieldName,
            opts?: core.CommonInputFieldConfig<TypeName, FieldName>
        ): void; // "DateTime";
        /**
         * An arbitrary-precision Decimal type
         */
        decimal<FieldName extends string>(
            fieldName: FieldName,
            opts?: core.CommonInputFieldConfig<TypeName, FieldName>
        ): void; // "Decimal";
        /**
         * The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
         */
        json<FieldName extends string>(
            fieldName: FieldName,
            opts?: core.CommonInputFieldConfig<TypeName, FieldName>
        ): void; // "Json";
        /**
         * Must and only use for input
         */
        relayId<FieldName extends string>(
            fieldName: FieldName,
            opts?: core.CommonInputFieldConfig<TypeName, FieldName>
        ): void; // "RelayId";
    }
}
declare global {
    interface NexusGenCustomOutputMethods<TypeName extends string> {
        /**
         * The `BigInt` scalar type represents non-fractional signed whole numeric values.
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
         */
        bigInt<FieldName extends string>(
            fieldName: FieldName,
            ...opts: core.ScalarOutSpread<TypeName, FieldName>
        ): void; // "BigInt";
        /**
         * The `Byte` scalar type represents byte value as a Buffer
         */
        bytes<FieldName extends string>(
            fieldName: FieldName,
            ...opts: core.ScalarOutSpread<TypeName, FieldName>
        ): void; // "Bytes";
        /**
         * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
         */
        dateTime<FieldName extends string>(
            fieldName: FieldName,
            ...opts: core.ScalarOutSpread<TypeName, FieldName>
        ): void; // "DateTime";
        /**
         * An arbitrary-precision Decimal type
         */
        decimal<FieldName extends string>(
            fieldName: FieldName,
            ...opts: core.ScalarOutSpread<TypeName, FieldName>
        ): void; // "Decimal";
        /**
         * The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
         */
        json<FieldName extends string>(
            fieldName: FieldName,
            ...opts: core.ScalarOutSpread<TypeName, FieldName>
        ): void; // "Json";
        /**
         * Must and only use for input
         */
        relayId<FieldName extends string>(
            fieldName: FieldName,
            ...opts: core.ScalarOutSpread<TypeName, FieldName>
        ): void; // "RelayId";
        /**
         * Adds a Relay-style connection to the type, with numerous options for configuration
         *
         * @see https://nexusjs.org/docs/plugins/connection
         */
        connectionField<FieldName extends string>(
            fieldName: FieldName,
            config: connectionPluginCore.ConnectionFieldConfig<
                TypeName,
                FieldName
            >
        ): void;
    }
}

declare global {
    interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
    AllUsersConnectionWhere: {
        // input type
        activated?: boolean | null; // Boolean
    };
}

export interface NexusGenEnums {}

export interface NexusGenScalars {
    String: string;
    Int: number;
    Float: number;
    Boolean: boolean;
    ID: string;
    BigInt: any;
    Bytes: any;
    DateTime: any;
    Decimal: any;
    Json: any;
    RelayId: any;
}

export interface NexusGenObjects {
    HelloType: {
        // root type
        errors: Array<string | null>; // [String]!
        message: string; // String!
        success: boolean; // Boolean!
    };
    PageInfo: {
        // root type
        endCursor?: string | null; // String
        hasNextPage: boolean; // Boolean!
        hasPreviousPage: boolean; // Boolean!
        startCursor?: string | null; // String
    };
    Query: {};
    User: {
        // root type
        activated: boolean; // Boolean!
        createdAt: NexusGenScalars['DateTime']; // DateTime!
        password: string; // String!
        username: string; // String!
    };
    UserConnection: {
        // root type
        edges: NexusGenRootTypes['UserEdge'][]; // [UserEdge!]!
        pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    };
    UserEdge: {
        // root type
        cursor: string; // String!
        node: NexusGenRootTypes['User']; // User!
    };
}

export interface NexusGenInterfaces {
    Node: NexusGenRootTypes['User'];
}

export interface NexusGenUnions {}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects;

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars;

export interface NexusGenFieldTypes {
    HelloType: {
        // field return type
        errors: Array<string | null>; // [String]!
        message: string; // String!
        success: boolean; // Boolean!
    };
    PageInfo: {
        // field return type
        endCursor: string | null; // String
        hasNextPage: boolean; // Boolean!
        hasPreviousPage: boolean; // Boolean!
        startCursor: string | null; // String
    };
    Query: {
        // field return type
        allUsers: NexusGenRootTypes['UserConnection']; // UserConnection!
        hello: NexusGenRootTypes['HelloType'] | null; // HelloType
        node: NexusGenRootTypes['Node'] | null; // Node
    };
    User: {
        // field return type
        activated: boolean; // Boolean!
        createdAt: NexusGenScalars['DateTime']; // DateTime!
        id: string; // ID!
        password: string; // String!
        username: string; // String!
    };
    UserConnection: {
        // field return type
        edges: NexusGenRootTypes['UserEdge'][]; // [UserEdge!]!
        pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    };
    UserEdge: {
        // field return type
        cursor: string; // String!
        node: NexusGenRootTypes['User']; // User!
    };
    Node: {
        // field return type
        id: string; // ID!
    };
}

export interface NexusGenFieldTypeNames {
    HelloType: {
        // field return type name
        errors: 'String';
        message: 'String';
        success: 'Boolean';
    };
    PageInfo: {
        // field return type name
        endCursor: 'String';
        hasNextPage: 'Boolean';
        hasPreviousPage: 'Boolean';
        startCursor: 'String';
    };
    Query: {
        // field return type name
        allUsers: 'UserConnection';
        hello: 'HelloType';
        node: 'Node';
    };
    User: {
        // field return type name
        activated: 'Boolean';
        createdAt: 'DateTime';
        id: 'ID';
        password: 'String';
        username: 'String';
    };
    UserConnection: {
        // field return type name
        edges: 'UserEdge';
        pageInfo: 'PageInfo';
    };
    UserEdge: {
        // field return type name
        cursor: 'String';
        node: 'User';
    };
    Node: {
        // field return type name
        id: 'ID';
    };
}

export interface NexusGenArgTypes {
    Query: {
        allUsers: {
            // args
            after?: string | null; // String
            first: number; // Int!
            where?: NexusGenInputs['AllUsersConnectionWhere'] | null; // AllUsersConnectionWhere
        };
        node: {
            // args
            id: string; // ID!
        };
    };
}

export interface NexusGenAbstractTypeMembers {
    Node: 'User';
}

export interface NexusGenTypeInterfaces {
    User: 'Node';
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = 'Node';

export type NexusGenFeaturesConfig = {
    abstractTypeStrategies: {
        isTypeOf: false;
        resolveType: true;
        __typename: false;
    };
};

export interface NexusGenTypes {
    context: Context;
    inputTypes: NexusGenInputs;
    rootTypes: NexusGenRootTypes;
    inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
    argTypes: NexusGenArgTypes;
    fieldTypes: NexusGenFieldTypes;
    fieldTypeNames: NexusGenFieldTypeNames;
    allTypes: NexusGenAllTypes;
    typeInterfaces: NexusGenTypeInterfaces;
    objectNames: NexusGenObjectNames;
    inputNames: NexusGenInputNames;
    enumNames: NexusGenEnumNames;
    interfaceNames: NexusGenInterfaceNames;
    scalarNames: NexusGenScalarNames;
    unionNames: NexusGenUnionNames;
    allInputTypes:
        | NexusGenTypes['inputNames']
        | NexusGenTypes['enumNames']
        | NexusGenTypes['scalarNames'];
    allOutputTypes:
        | NexusGenTypes['objectNames']
        | NexusGenTypes['enumNames']
        | NexusGenTypes['unionNames']
        | NexusGenTypes['interfaceNames']
        | NexusGenTypes['scalarNames'];
    allNamedTypes:
        | NexusGenTypes['allInputTypes']
        | NexusGenTypes['allOutputTypes'];
    abstractTypes:
        | NexusGenTypes['interfaceNames']
        | NexusGenTypes['unionNames'];
    abstractTypeMembers: NexusGenAbstractTypeMembers;
    objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
    abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
    features: NexusGenFeaturesConfig;
}

declare global {
    interface NexusGenPluginTypeConfig<TypeName extends string> {}
    interface NexusGenPluginInputTypeConfig<TypeName extends string> {}
    interface NexusGenPluginFieldConfig<
        TypeName extends string,
        FieldName extends string
    > {}
    interface NexusGenPluginInputFieldConfig<
        TypeName extends string,
        FieldName extends string
    > {}
    interface NexusGenPluginSchemaConfig {}
    interface NexusGenPluginArgConfig {}
}