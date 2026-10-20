# IronVault Fitness

Next.js gym website with an admin dashboard, memberships, bookings and a supplement store.

## Local development

```sh
npm install
cp .env.example .env.local
# Set ADMIN_EMAIL, a unique ADMIN_PASSWORD (12+ characters) and SESSION_SECRET (32+ characters).
npm run dev
```

Open http://localhost:3000. Sign in at `/admin/login` using the credentials in `.env.local`. No credentials are displayed on the website or committed to Git. A local `.env.local` may already have been generated during setup; keep it private.

```sh
npm test
npm run lint
npm run build
npm start
```

## Storage and deployment

The server uses SQLite (`better-sqlite3`), with transactional writes and WAL journaling. Data is initialized from the sample seed once and persists across restarts in `.data/gym.sqlite`. All admin edits and customer submissions use the same database. Artificial database delays have been removed.

Set `GYM_DATA_DIR` to a **persistent local disk** in production, and back up the database with SQLite's backup facilities. This app requires the Node.js runtime and a compatible native SQLite binary. Ephemeral/serverless hosting and separate machines with independent disks require a hosted database adapter before deployment. Do not place SQLite WAL databases on a network filesystem. Public pages render on request to reflect database updates across processes.

Configure the same `SESSION_SECRET` for every server process; changing it signs everyone out. Production sessions require HTTPS. Admin login is disabled until credentials are configured. Login attempts are limited to 10 per 15 minutes for the admin account. The old demo credentials no longer work.

## Customer flows

- Product prices, shipping and quantities are checked on the server. Duplicate cart lines are combined before inventory is checked. Inventory updates and order creation happen in one transaction.
- Membership requests are **pending**, with server-calculated cycle totals. An administrator can activate the member after payment is verified. Public requests cannot alter an existing member using only an email address.
- No payment provider is connected. Checkout remains clearly labeled as a demo, and pending orders do not represent collected payments. A real provider requires merchant credentials and verified payment webhooks.
- Receipt pages require a signed HttpOnly cookie issued to the browser that submitted the request (8-hour lifetime), or an authenticated admin session. Sharing the URL alone does not grant access.
- Appointments reject past dates, invalid times and unavailable weekdays. Restoring cancelled bookings checks capacity or appointment conflicts.
- Fonts and their open font licenses are bundled under `app/fonts`; builds do not download fonts.

Regression tests cover authorization, forged and expired sessions, private receipts, price tampering, invalid quantities, overselling, persistence across processes, membership validation and appointment rules. The test loader supplies lightweight Next.js request stubs only for unit tests; production builds use the actual framework.
