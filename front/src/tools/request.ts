import { getSdk } from '../../gql/sdk';
import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient('/graphql');
export const sdk = getSdk(client, async (action) => {
  const session = localStorage.getItem('session');
  if (!session) {
    return await action();
  } else {
    try {
      return await action({ Authorization: session })
    } catch (e) {
      if (e?.response?.errors?.find(e => e?.message === 'Token expired')) {
        localStorage.removeItem('session');
        try {
          return await action();
        } catch (e2) {
          throw e;
        }
      }
      return await action();
    }
  }
});
