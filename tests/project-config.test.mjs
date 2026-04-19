import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('package scripts include dev/build/check', () => {
  assert.equal(typeof pkg.scripts?.dev, 'string');
  assert.equal(typeof pkg.scripts?.build, 'string');
  assert.equal(typeof pkg.scripts?.check, 'string');
});
