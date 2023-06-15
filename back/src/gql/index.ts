import { DateTimeTypeDefinition, TimeTypeDefinition } from 'graphql-scalars';
import { readFile } from 'node:fs/promises';
import { getResolvers } from './resolvers';
import { RequestHandler } from 'express';
import { ApolloServer, type ApolloServerPlugin } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { GqlContext } from '../types/gqlContext';
import { Controller } from '../controller';

async function getTypedef() {
  const codeSchema = await readFile('./schema.graphql', 'utf8');
  return codeSchema;
}

export async function getBuilderMiddlewareApollo(controllers: Controller) {
  const schema = await getTypedef();
  const root = await getResolvers(controllers);
  return async function getMiddleware(plugins: ApolloServerPlugin[]): Promise<RequestHandler> {
    const server = new ApolloServer<GqlContext>({
      typeDefs: [DateTimeTypeDefinition, TimeTypeDefinition, schema],
      resolvers: root,
      plugins: [
        ...plugins,
        process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
            footer: false,
            embed: false
          })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false })
      ],
    });
    await server.start();
    return expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization;
        if (typeof token === 'string') {
          const me = await controllers.user.getUserFromToken(token);
          return {
            me
          };
        }
        return {
          me: null
        }
      },
    })
  }
}
