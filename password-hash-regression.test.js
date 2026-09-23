const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const routePath = path.join(__dirname, 'app/api/create-admin/route.ts');
const routeSource = fs.readFileSync(routePath, 'utf8');

test('create-admin stores hashed password in password_hash column', () => {
  assert.match(routeSource, /INSERT INTO users\s*\(name, email, password_hash, role\)/i);
  assert.doesNotMatch(routeSource, /INSERT INTO users\s*\(name, email, password, role\)/i);
});
