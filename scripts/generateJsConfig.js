import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

try {
  const tenant = process.env.NEXT_PUBLIC_TENANT;

  if (!tenant) {
    console.error('❌ NEXT_PUBLIC_TENANT environment variable is not set!');
    console.log('Please set it in .env.local or .env file');
    process.exit(1);
  }

  console.log(`🏢 Generating jsconfig.json for tenant: ${tenant}`);

  const jsconfig = {
    compilerOptions: {
      baseUrl: '.',
      paths: {
        '@tenantData': [`src/tenant/${tenant}/data`],
        '@tenantData/*': [`src/tenant/${tenant}/data/*`],
        '@data': [`src/tenant/common/data`],
        '@data/*': [`src/tenant/common/data/*`],
        '@/*': ['src/*'],
      },
    },
    include: ['src/**/*', 'next.config.js'],
  };

  const jsconfigPath = path.resolve(__dirname, '../jsconfig.json');
  fs.writeFileSync(jsconfigPath, JSON.stringify(jsconfig, null, 2));

  console.log(`✅ Generated jsconfig.json for tenant: ${tenant}`);
} catch (error) {
  console.error('❌ Error generating jsconfig.json:', error.message);
  process.exit(1);
}
