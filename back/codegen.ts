import { readFileSync } from 'fs';
import { DateTimeTypeDefinition, TimeTypeDefinition } from 'graphql-scalars';
import type { CodegenConfig } from '@graphql-codegen/cli';

const file = readFileSync('./schema.graphql', { encoding: 'utf-8' });

const config: CodegenConfig & { schema: string[] } = {
  overwrite: true,
  schema: [DateTimeTypeDefinition, TimeTypeDefinition, file],
  generates: {
    'src/types/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers']
    }
  },
  config: {
    contextType: './gqlContext#GqlContext',
    makeResolverTypeCallable: true,
    optionalResolveType: false,
    onlyResolveTypeForInterfaces: true,
    strictScalars: true,
    nonOptionalTypename: true,
    scalars: {
      DateTime: 'Date',
      Time: 'string'
    }
  }
};

export default config;
