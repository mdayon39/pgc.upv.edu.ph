import { createHmac, timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { getAdminAuth } from '@/lib/firebase-admin';

export const ADMIN_SESSION_COOKIE = 'pgc_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

type SessionPayload = {
  uid: string;
  email: string;
  exp: number;
};

const getSecret = () => process.env.ADMIN_SESSION_SECRET ?? '';

const base64UrlEncode = (value: string) => Buffer.from(value, 'utf8').toString('base64url');
const base64UrlDecode = (value: string) => Buffer.from(value, 'base64url').toString('utf8');

const safeEqual = (a: string, b: string) => {
  const aBuffer = Buffer.from(a, 'utf8');
  const bBuffer = Buffer.from(b, 'utf8');

  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
};

const signPayload = (payload: string, secret: string) =>
  createHmac('sha256', secret).update(payload).digest('base64url');

export const validateAdminCredentials = (username: string, password: string) => {
  return Boolean(username && password);
};

export const createAdminSessionToken = (user: { uid: string; email: string }) => {
  const secret = getSecret();
  if (!secret) return null;

  const payload: SessionPayload = {
    uid: user.uid,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
};

export const verifyAdminSessionToken = (token: string | undefined | null): SessionPayload | null => {
  if (!token) return null;

  const secret = getSecret();
  if (!secret) return null;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload, secret);
  if (!safeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
};

export const isAdminRequest = (request: NextRequest) => {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token) !== null;
};

const isEmailAllowlisted = (email: string) => {
  const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  if (!allowlist.length) return false;
  return allowlist.includes(email.toLowerCase());
};

const hasAdminClaim = (decoded: DecodedIdToken) => decoded.admin === true;

export const verifyAdminIdTokenAndAuthorize = async (idToken: string) => {
  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    throw new Error('Firebase Admin is not configured.');
  }

  const decoded = await adminAuth.verifyIdToken(idToken, true);
  const email = decoded.email ?? '';
  const authorized = hasAdminClaim(decoded) || isEmailAllowlisted(email);

  if (!authorized) {
    throw new Error('Account is not authorized for admin access.');
  }

  if (!email) {
    throw new Error('Authenticated account has no email.');
  }

  return {
    uid: decoded.uid,
    email,
  };
};
