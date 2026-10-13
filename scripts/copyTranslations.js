const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const tenant = process.env.NEXT_PUBLIC_TENANT || 'default';

const baseLocalesPath = path.resolve(__dirname, '../src/dictionaries');
const tenantLocalesPath = path.join(baseLocalesPath, tenant);

function cleanBaseLocalesExceptTenant() {
  const items = fs.readdirSync(baseLocalesPath);
  items.forEach((item) => {
    if (item === tenant) return; // skip selected tenant

    const itemPath = path.join(baseLocalesPath, item);
    fs.rmSync(itemPath, { recursive: true, force: true });
  });
}

function copyTenantLocales() {
  const tenantFiles = fs.readdirSync(tenantLocalesPath);
  tenantFiles.forEach((lang) => {
    const srcLangPath = path.join(tenantLocalesPath, lang);
    const destLangPath = path.join(baseLocalesPath, lang);

    fs.cpSync(srcLangPath, destLangPath, { recursive: true });
  });
}

if (fs.existsSync(tenantLocalesPath)) {
  console.log(`Found tenant locales for "${tenant}", applying...`);

  cleanBaseLocalesExceptTenant();
  copyTenantLocales();
  console.log(`Locales from "${tenant}" applied to /src/dictionaries.`);
} else {
  console.log(
    `No tenant locale folder found for "${tenant}". Using default locales.`,
  );
}
