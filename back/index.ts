import { getBuilderMiddlewareApollo } from './src/gql';
import { getExpress } from './src/express';
import { getController } from './src/controller';
import { getService } from './src/service';
import { getComponent } from './src/component';

async function main() {
  console.time('start')
  const service = getService();
  const component = getComponent(service);
  const controller = getController(component);
  const getMiddleware = await getBuilderMiddlewareApollo(controller);
  const app = await getExpress({ graphql: getMiddleware });
  app.listen(3001, () => {
    console.log('Listening on port http://localhost:3001/graphql');
    console.timeEnd('start')
  })
}

main().catch(err => console.error(err));
