import express from 'express';
import http from 'http';
import os from 'os';
import bodyParser from 'body-parser';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { type ApolloServerPlugin } from '@apollo/server';
import multer from 'multer';
import { decodeDesECBStr, encodeDesECBStr, wrapId } from '../tools/wrap_id';
import { createReadStream } from 'fs';

const upload = multer({ dest: os.tmpdir() });

export async function getExpress({ graphql }: { graphql: (plugins: ApolloServerPlugin[]) => Promise<express.RequestHandler> }) {
  const app = express();
  const httpServer = http.createServer(app);
  const graphqlResolver = await graphql([
    ApolloServerPluginDrainHttpServer({ httpServer })
  ]);
  app.use('/graphql', bodyParser.json(), graphqlResolver);
  app.get('/api/photo/*', async (req, res) => {
    const id = req.path.replace('/api/photo/', '');
    console.log(id);
    if (!id) {
      res.status(404).send('Not found');
      return;
    }
    try {
      const path = decodeDesECBStr(id, 'qwe123123rqwe');
      console.log(path);
      const file = createReadStream(path);
      res.setHeader('Content-Type', 'image/jpeg');
      file.pipe(res);
    } catch (e) {
      console.log(e);
      res.status(404).send('Not found');
    }
  });
  app.post('/api/save-photo', upload.single('photo'), (req, res) => {
    const file = req.file;

    const path = file?.path;
    if (!path) {
      res.status(400).send('No file');
      return;
    }
    res.send({
      url: `/api/photo/${encodeDesECBStr(path, 'qwe123123rqwe')}`
    });
  });
  app.all('*', (req, res) => {
    res.status(404).send('Not found');
  });
  return app;
}
