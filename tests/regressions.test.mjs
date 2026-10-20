import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, execFile } from 'node:child_process';
import { getStore, withStoreTransaction } from '../lib/db/store.js';
import * as products from '../lib/db/supplements.js';
import * as classes from '../lib/db/classes.js';
import * as memberships from '../lib/db/memberships.js';
import * as pt from '../lib/db/personalTraining.js';
import * as nutrition from '../lib/db/nutrition.js';
import { signToken, verifyToken } from '../lib/security/tokens.js';
import { addMonthsClamped, todayInIndia, isValidDate } from '../lib/utils/dates.js';
import { membershipSignupSchema, ptBookingSchema } from '../lib/validation/schemas.js';

const dir = mkdtempSync(path.join(os.tmpdir(), 'gym-regressions-'));
process.env.GYM_DATA_DIR = dir;
process.env.SESSION_SECRET = 'test-only-session-secret-that-is-more-than-32-characters';
test.after(() => rmSync(dir, { recursive: true, force: true }));
const customer = { name: 'Test User', email: 'test@example.com', phone: '9999999999' };

test('rejects negative, zero, fractional, string and oversized quantities without changing stock', async () => {
  const product = (await products.listSupplements())[0];
  for (const qty of [-3, 0, 1.5, '2', 1000]) {
    assert.equal((await products.createOrder({ items: [{ slug: product.slug, qty }], customer })).success, false);
    assert.equal((await products.getSupplementBySlug(product.slug)).stock, product.stock);
  }
});

test('duplicate product lines cannot oversell stock', async () => {
  const product = (await products.listSupplements())[0];
  const result = await products.createOrder({ items: [1, 2].map(() => ({ slug: product.slug, qty: product.stock })), customer });
  assert.equal(result.success, false);
  assert.equal((await products.getSupplementBySlug(product.slug)).stock, product.stock);
});

test('canonical catalog prices replace browser prices and survive a new process', async () => {
  const product = (await products.listSupplements())[0];
  const result = await products.createOrder({ items: [{ slug: product.slug, qty: 1, price: 1 }], customer });
  assert.equal(result.order.subtotal, product.discountPrice ?? product.price);
  const script = `import {getOrderById} from './lib/db/supplements.js'; console.log(JSON.stringify(await getOrderById(${JSON.stringify(result.order.id)})));`;
  const saved = JSON.parse(execFileSync(process.execPath, ['--experimental-default-type=module', '--loader', './tests/loader.mjs', '--input-type=module', '-e', script], { env: process.env, encoding: 'utf8' }));
  assert.equal(saved.id, result.order.id);
});

test('concurrent orders cannot sell the last unit twice', async () => {
  const product = (await products.listSupplements())[1];
  await withStoreTransaction(() => { getStore().supplements.find(p => p.slug === product.slug).stock = 1; });
  const results = await Promise.all([1, 2].map(() => products.createOrder({ items: [{ slug: product.slug, qty: 1 }], customer })));
  assert.equal(results.filter(r => r.success).length, 1);
  assert.equal((await products.getSupplementBySlug(product.slug)).stock, 0);
});

test('independent processes cannot oversell shared inventory', async () => {
  const product = (await products.listSupplements())[2];
  await withStoreTransaction(() => { getStore().supplements.find(p => p.slug === product.slug).stock = 1; });
  const script = `import {createOrder} from './lib/db/supplements.js'; console.log(JSON.stringify(await createOrder({items:[{slug:${JSON.stringify(product.slug)},qty:1}],customer:{name:'Process'}})));`;
  const buy = () => new Promise((resolve, reject) => execFile(process.execPath, ['--experimental-default-type=module', '--loader', './tests/loader.mjs', '--input-type=module', '-e', script], { env: process.env, encoding: 'utf8' }, (error, stdout) => error ? reject(error) : resolve(JSON.parse(stdout))));
  const results = await Promise.all([buy(), buy()]);
  assert.equal(results.filter(r => r.success).length, 1);
  assert.equal((await products.getSupplementBySlug(product.slug)).stock, 0);
});

test('restoring cancelled bookings restores capacity and rejects restoring into a full class', async () => {
  const session = (await classes.listSchedule()).find(s => !s.isFull);
  const booked = await classes.bookClass({ sessionId: session.id, ...customer });
  await classes.updateBookingStatus(booked.booking.id, 'cancelled');
  assert.equal((await classes.getSessionById(session.id)).booked, session.booked);
  await classes.updateBookingStatus(booked.booking.id, 'confirmed');
  assert.equal((await classes.getSessionById(session.id)).booked, session.booked + 1);
  await classes.updateBookingStatus(booked.booking.id, 'cancelled');
  await classes.updateSession(session.id, { booked: session.capacity });
  await assert.rejects(classes.updateBookingStatus(booked.booking.id, 'confirmed'), /No seats/);
  assert.equal((await classes.listBookings()).find(b => b.id === booked.booking.id).status, 'cancelled');
});

test('membership uses catalog prices, stays pending, and rejects unknown plans and dates', async () => {
  const plan = (await memberships.listPlans())[0];
  const input = { planSlug: plan.slug, billingCycleId: 'monthly', startDate: todayInIndia(), fullName: customer.name, ...customer, fitnessGoal: 'Strength', price: 1 };
  const result = await memberships.createMembershipSignup(input);
  assert.equal(result.membership.price, plan.monthlyPrice);
  assert.equal(result.membership.status, 'pending');
  assert.equal((await memberships.createMembershipSignup({ ...input, planSlug: 'missing' })).success, false);
  assert.equal((await memberships.createMembershipSignup({ ...input, startDate: '2026-02-31' })).success, false);
  assert.equal(membershipSignupSchema.safeParse({ ...input, startDate: 'bad' }).success, false);
});

test('public membership requests cannot modify another existing member by email', async () => {
  const member = structuredClone(getStore().members[0]);
  await memberships.createMembershipSignup({ planSlug: 'basic', billingCycleId: 'monthly', startDate: todayInIndia(), fullName: 'Impersonator', email: member.email, phone: '9999999999', fitnessGoal: 'Other' });
  assert.deepEqual(getStore().members.find(m => m.id === member.id), member);
});

test('appointment server rejects past dates and fabricated times', async () => {
  const trainer = getStore().trainers[0];
  const nutritionist = getStore().nutritionists[0];
  assert.equal((await pt.bookPersonalTraining({ trainerSlug: trainer.slug, date: '2000-01-01', time: '06:00', ...customer })).success, false);
  assert.equal((await nutrition.bookConsultation({ nutritionistSlug: nutritionist.slug, date: '2099-01-01', time: '03:17', ...customer })).success, false);
  assert.equal(ptBookingSchema.safeParse({ trainerSlug: trainer.slug, date: 'bad', time: '06:00', goal: 'Strength', ...customer }).success, false);
});

test('signed tokens reject forgery, tampering and expiration', () => {
  const token = signToken({ purpose: 'admin', email: 'admin@example.com' });
  assert.equal(verifyToken(token).purpose, 'admin');
  assert.equal(verifyToken('demo-authenticated'), null);
  assert.equal(verifyToken(token + 'changed'), null);
  assert.equal(verifyToken(signToken({ purpose: 'admin' }, -1)), null);
});

test('membership expiry clamps end of month and rejects invalid calendar dates', () => {
  assert.equal(addMonthsClamped('2027-01-31', 1), '2027-02-28');
  assert.equal(addMonthsClamped('2028-01-31', 1), '2028-02-29');
  assert.equal(isValidDate('2027-02-29'), false);
});
