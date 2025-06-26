/* eslint-disable no-magic-numbers */

import { createApp, createSwaggerDocument, bootstrap } from './bootstrap';

async function main() {
  const app = await createApp();
  const swaggerDocument = createSwaggerDocument(app);
  await bootstrap(app, swaggerDocument);
}

main();
