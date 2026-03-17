import { cookies } from 'next/headers';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/admin-auth';
import { getManagedMenu, getManagedContentBlocks } from '@/lib/site-config';
import AdminLoginForm from '@/components/admin/admin-login-form';
import AdminPanel from '@/components/admin/admin-panel';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = verifyAdminSessionToken(token);

  if (!session) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-16">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Admin Login</h1>
        <p className="mb-6 text-sm text-slate-600">
          Sign in with your Firebase admin account to manage navigation menus, submenus, and homepage content blocks.
        </p>
        <AdminLoginForm />
      </main>
    );
  }

  const [menuItems, contentBlocks] = await Promise.all([
    getManagedMenu(),
    getManagedContentBlocks(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Site Admin</h1>
          <p className="text-sm text-slate-600">
            Manage site navigation and homepage blocks without redeploying content files.
          </p>
        </div>
      </div>
      <AdminPanel initialMenuItems={menuItems} initialContentBlocks={contentBlocks} />
    </main>
  );
}
