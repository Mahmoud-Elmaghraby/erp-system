import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'modules/prisma/schema.prisma',

  datasource: {
    url: env('DATABASE_URL'),
  },

  migrations: {
    seed: 'npx tsx backend/src/seeds/seed.ts',
  },
});