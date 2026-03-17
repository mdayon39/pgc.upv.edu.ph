import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { getMenuItems } from '@/services/wordpress';

export type ManagedMenuItem = {
  id: string;
  label: string;
  href: string;
  order: number;
  children?: ManagedMenuItem[];
};

export type ManagedContentBlock = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  order: number;
  enabled: boolean;
};

const SITE_CONFIG_COLLECTION = 'site_config';
const MENU_DOC = 'navigation';
const CONTENT_DOC = 'home_content';

const defaultContentBlocks: ManagedContentBlock[] = [
  {
    id: 'services',
    title: 'Services',
    description: 'Access sequencing, laboratory equipment, storage, and bioinformatics support.',
    imageUrl: '',
    href: '/pgc-visayas-services',
    order: 1,
    enabled: true,
  },
  {
    id: 'opportunities',
    title: 'Opportunities',
    description: 'Find internship, training, and capacity-building opportunities for students and researchers.',
    imageUrl: '',
    href: '/opportunities',
    order: 2,
    enabled: true,
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Coordinate with PGC Visayas for project inquiries, collaborations, and service requests.',
    imageUrl: '',
    href: '/contact',
    order: 3,
    enabled: true,
  },
];

const normalizeMenuItems = (items: ManagedMenuItem[]): ManagedMenuItem[] => {
  return items
    .map((item, idx) => ({
      id: item.id || `${item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx}`,
      label: item.label?.trim() ?? '',
      href: item.href?.trim() || '#',
      order: Number.isFinite(item.order) ? item.order : idx + 1,
      children: item.children?.map((child, childIdx) => ({
        id: child.id || `${child.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${childIdx}`,
        label: child.label?.trim() ?? '',
        href: child.href?.trim() || '#',
        order: Number.isFinite(child.order) ? child.order : childIdx + 1,
      })),
    }))
    .filter((item) => item.label.length > 0)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      ...item,
      children: (item.children ?? [])
        .filter((child) => child.label.length > 0)
        .sort((a, b) => a.order - b.order),
    }));
};

const normalizeContentBlocks = (blocks: ManagedContentBlock[]): ManagedContentBlock[] => {
  return blocks
    .map((block, idx) => ({
      id: block.id || `${block.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx}`,
      title: block.title?.trim() ?? '',
      description: block.description?.trim() ?? '',
      imageUrl: block.imageUrl?.trim() ?? '',
      href: block.href?.trim() || '#',
      order: Number.isFinite(block.order) ? block.order : idx + 1,
      enabled: Boolean(block.enabled),
    }))
    .filter((block) => block.title.length > 0)
    .sort((a, b) => a.order - b.order);
};

const mapFallbackMenu = async (): Promise<ManagedMenuItem[]> => {
  const items = await getMenuItems();
  return items.map((item, idx) => ({
    id: `menu-${idx + 1}`,
    label: item.label,
    href: item.href,
    order: idx + 1,
    children: item.children?.map((child, childIdx) => ({
      id: `menu-${idx + 1}-child-${childIdx + 1}`,
      label: child.label,
      href: child.href,
      order: childIdx + 1,
    })),
  }));
};

export const getManagedMenu = async (): Promise<ManagedMenuItem[]> => {
  const db = getAdminDb();
  if (!db) return mapFallbackMenu();

  const snap = await db.collection(SITE_CONFIG_COLLECTION).doc(MENU_DOC).get();
  const data = snap.data();
  if (!data?.items || !Array.isArray(data.items)) return mapFallbackMenu();
  return normalizeMenuItems(data.items as ManagedMenuItem[]);
};

export const saveManagedMenu = async (items: ManagedMenuItem[]) => {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured.');

  const normalized = normalizeMenuItems(items);
  await db.collection(SITE_CONFIG_COLLECTION).doc(MENU_DOC).set(
    {
      items: normalized,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return normalized;
};

export const getManagedContentBlocks = async (): Promise<ManagedContentBlock[]> => {
  const db = getAdminDb();
  if (!db) return defaultContentBlocks;

  const snap = await db.collection(SITE_CONFIG_COLLECTION).doc(CONTENT_DOC).get();
  const data = snap.data();
  if (!data?.blocks || !Array.isArray(data.blocks)) return defaultContentBlocks;
  return normalizeContentBlocks(data.blocks as ManagedContentBlock[]);
};

export const saveManagedContentBlocks = async (blocks: ManagedContentBlock[]) => {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured.');

  const normalized = normalizeContentBlocks(blocks);
  await db.collection(SITE_CONFIG_COLLECTION).doc(CONTENT_DOC).set(
    {
      blocks: normalized,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return normalized;
};
