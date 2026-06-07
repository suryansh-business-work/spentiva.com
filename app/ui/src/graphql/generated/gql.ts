/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment AuthUser on User {\n    id\n    email\n    firstName\n    lastName\n    profilePicture\n    role\n    isVerified\n    createdAt\n    updatedAt\n  }\n": typeof types.AuthUserFragmentDoc,
    "\n  query Me {\n    me {\n      ...AuthUser\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...AuthUser\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...AuthUser\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(input: { email: $email })\n  }\n": typeof types.ForgotPasswordDocument,
    "\n  mutation ResetPassword($token: String!, $password: String!) {\n    resetPassword(input: { token: $token, password: $password })\n  }\n": typeof types.ResetPasswordDocument,
    "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      ...AuthUser\n    }\n  }\n": typeof types.UpdateProfileDocument,
};
const documents: Documents = {
    "\n  fragment AuthUser on User {\n    id\n    email\n    firstName\n    lastName\n    profilePicture\n    role\n    isVerified\n    createdAt\n    updatedAt\n  }\n": types.AuthUserFragmentDoc,
    "\n  query Me {\n    me {\n      ...AuthUser\n    }\n  }\n": types.MeDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...AuthUser\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...AuthUser\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(input: { email: $email })\n  }\n": types.ForgotPasswordDocument,
    "\n  mutation ResetPassword($token: String!, $password: String!) {\n    resetPassword(input: { token: $token, password: $password })\n  }\n": types.ResetPasswordDocument,
    "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      ...AuthUser\n    }\n  }\n": types.UpdateProfileDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AuthUser on User {\n    id\n    email\n    firstName\n    lastName\n    profilePicture\n    role\n    isVerified\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment AuthUser on User {\n    id\n    email\n    firstName\n    lastName\n    profilePicture\n    role\n    isVerified\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      ...AuthUser\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      ...AuthUser\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...AuthUser\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...AuthUser\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...AuthUser\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...AuthUser\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(input: { email: $email })\n  }\n"): (typeof documents)["\n  mutation ForgotPassword($email: String!) {\n    forgotPassword(input: { email: $email })\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetPassword($token: String!, $password: String!) {\n    resetPassword(input: { token: $token, password: $password })\n  }\n"): (typeof documents)["\n  mutation ResetPassword($token: String!, $password: String!) {\n    resetPassword(input: { token: $token, password: $password })\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      ...AuthUser\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      ...AuthUser\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;