import { createApp, createSwaggerDocument, bootstrap } from './bootstrap';

async function main() {
  const app = await createApp();
  const swaggerDocument = createSwaggerDocument(app);
  await bootstrap(app, swaggerDocument);
}

main().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});
