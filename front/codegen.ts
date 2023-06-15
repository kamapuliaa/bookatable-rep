import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://127.0.0.1:3001/graphql',
  documents: ['src/query.ts'],
  generates: {
    'gql/sdk.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      
    },
    'gql/': {
      preset: 'client',
    }
  },
  config: {
    strictScalars: true,
    nonOptionalTypename: true,
    scalars: {
      DateTime: 'string',
      Time: 'string',
    }
  }
};
export default config;
