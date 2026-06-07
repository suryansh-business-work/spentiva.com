import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * GraphQL Code Generator (client preset).
 * Operations are authored inline via the generated `graphql()` function in
 * `src/**` and produce fully-typed TypedDocumentNodes consumed by Apollo hooks.
 * Regenerate the server contract with `npm run schema:export` in app/server.
 */
const config: CodegenConfig = {
  schema: '../server/schema.graphql',
  documents: ['src/**/*.{ts,tsx}', '!src/graphql/generated/**'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, unknown>',
        },
      },
    },
  },
};

export default config;
