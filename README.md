This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Admin Management Setup

The app includes an admin area at `/admin` for managing:

- Main menus and submenus
- Homepage content blocks (title, description, image URL, link, order, enabled state)

### Authentication and Authorization

Admin login uses Firebase Authentication (email/password) and server-side authorization via Firebase Admin SDK.

Access is granted if either:

- The Firebase user has custom claim `admin: true`
- The user's email is listed in `ADMIN_EMAIL_ALLOWLIST`

### Required Environment Variables

Set these in `.env.local` and in Vercel project settings:

```bash
# Existing Firebase web SDK vars (already used by frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK vars (server only)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Admin session signing secret
ADMIN_SESSION_SECRET=

# Optional email allowlist fallback (comma-separated)
ADMIN_EMAIL_ALLOWLIST=admin1@domain.com,admin2@domain.com
```

### Recommended: Use Custom Claims

Custom claims are safer and easier to audit than broad allowlists.

Example script (run locally with service account access):

```js
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

initializeApp({
	credential: cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
	}),
});

await getAuth().setCustomUserClaims('FIREBASE_UID_HERE', { admin: true });
console.log('Admin claim set.');
```

Security recommendations:

- Use long, unique `ADMIN_SESSION_SECRET` and rotate periodically.
- Restrict who can create Firebase Auth users.
- Add MFA for admin accounts in Firebase Auth.
- Log admin actions (who changed what and when).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
