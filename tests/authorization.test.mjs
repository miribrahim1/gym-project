import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { jar } from './next-headers.mjs';
import * as actions from '../lib/actions/adminCrud.js';
import { updateSettingsAction } from '../lib/actions/settings.js';
import { loginAdmin, isAdminAuthenticated } from '../lib/actions/auth.js';
import { grantConfirmationAccess, hasConfirmationAccess } from '../lib/security/confirmation.js';
import { getStore, withStoreTransaction } from '../lib/db/store.js';

const dir = mkdtempSync(path.join(os.tmpdir(), 'gym-auth-'));
process.env.GYM_DATA_DIR = dir;
process.env.SESSION_SECRET = 'test-session-signing-secret-longer-than-32-characters';
process.env.ADMIN_EMAIL = 'admin@example.com';
process.env.ADMIN_PASSWORD = 'secure-test-password-123456';
test.after(() => rmSync(dir, { recursive: true, force: true }));

test('every admin mutation rejects anonymous callers before accessing data', async () => {
  jar.clear();
  for (const action of [...Object.values(actions), updateSettingsAction]) await assert.rejects(action(), /Unauthorized/);
});

test('forged legacy session cookie does not authenticate', async () => {
  jar.set('ironvault_admin_session', 'demo-authenticated');
  assert.equal(await isAdminAuthenticated(), false);
  await assert.rejects(updateSettingsAction({ gymName: 'Injected' }), /Unauthorized/);
});

test('configured login issues a signed session and authenticates admin', async () => {
  jar.clear();
  assert.equal((await loginAdmin({ email: 'admin@example.com', password: 'wrong' })).success, false);
  assert.equal((await loginAdmin({ email: 'admin@example.com', password: process.env.ADMIN_PASSWORD })).success, true);
  assert.equal(await isAdminAuthenticated(), true);
  jar.clear();
});

test('receipt access is bound to its kind, id and issuing browser cookie', async () => {
  const id = 'ORD_test';
  assert.equal(await hasConfirmationAccess('order', id), false);
  await grantConfirmationAccess('order', id);
  assert.equal(await hasConfirmationAccess('order', id), true);
  assert.equal(await hasConfirmationAccess('membership', id), false);
  assert.equal(await hasConfirmationAccess('order', 'ORD_other'), false);
  jar.clear();
  assert.equal(await hasConfirmationAccess('order', id), false);
});

test('login throttles repeated failures', async () => {
  withStoreTransaction(() => { delete getStore().loginThrottle; });
  for (let i = 0; i < 10; i++) await loginAdmin({ email: 'admin@example.com', password: 'wrong' });
  assert.match((await loginAdmin({ email: 'admin@example.com', password: 'wrong' })).error, /Too many/);
});
