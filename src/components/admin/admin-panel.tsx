'use client';

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import type { ManagedContentBlock, ManagedMenuItem } from '@/lib/site-config';
import { auth } from '@/lib/firebase';

type Props = {
  initialMenuItems: ManagedMenuItem[];
  initialContentBlocks: ManagedContentBlock[];
};

const makeId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function AdminPanel({ initialMenuItems, initialContentBlocks }: Props) {
  const [menuItems, setMenuItems] = useState<ManagedMenuItem[]>(initialMenuItems);
  const [contentBlocks, setContentBlocks] = useState<ManagedContentBlock[]>(initialContentBlocks);
  const [isSavingMenu, setIsSavingMenu] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [message, setMessage] = useState('');

  const addMenuItem = () => {
    setMenuItems((prev) => [
      ...prev,
      { id: makeId(), label: 'New Menu', href: '/', order: prev.length + 1, children: [] },
    ]);
  };

  const addSubMenuItem = (menuIndex: number) => {
    setMenuItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== menuIndex) return item;
        const children = item.children ?? [];
        return {
          ...item,
          children: [
            ...children,
            {
              id: makeId(),
              label: 'New Submenu',
              href: '/',
              order: children.length + 1,
            },
          ],
        };
      }),
    );
  };

  const saveMenu = async () => {
    setIsSavingMenu(true);
    setMessage('');

    const response = await fetch('/api/admin/menu', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: menuItems }),
    });

    const body = (await response.json().catch(() => null)) as
      | { error?: string; items?: ManagedMenuItem[] }
      | null;

    if (!response.ok) {
      setMessage(body?.error ?? 'Failed to save menu.');
      setIsSavingMenu(false);
      return;
    }

    setMenuItems(body?.items ?? menuItems);
    setMessage('Menu saved.');
    setIsSavingMenu(false);
  };

  const addContentBlock = () => {
    setContentBlocks((prev) => [
      ...prev,
      {
        id: makeId(),
        title: 'New Card',
        description: 'Description',
        imageUrl: '',
        href: '/',
        order: prev.length + 1,
        enabled: true,
      },
    ]);
  };

  const saveContent = async () => {
    setIsSavingContent(true);
    setMessage('');

    const response = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks: contentBlocks }),
    });

    const body = (await response.json().catch(() => null)) as
      | { error?: string; blocks?: ManagedContentBlock[] }
      | null;

    if (!response.ok) {
      setMessage(body?.error ?? 'Failed to save content blocks.');
      setIsSavingContent(false);
      return;
    }

    setContentBlocks(body?.blocks ?? contentBlocks);
    setMessage('Content blocks saved.');
    setIsSavingContent(false);
  };

  const handleSignOut = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    await signOut(auth).catch(() => null);
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Menu and Submenu Manager</h2>
          <button
            type="button"
            onClick={addMenuItem}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            Add Menu
          </button>
        </div>

        <div className="space-y-4">
          {menuItems.map((item, menuIndex) => (
            <div key={item.id} className="rounded-md border border-slate-200 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={item.label}
                  onChange={(e) =>
                    setMenuItems((prev) =>
                      prev.map((entry, idx) =>
                        idx === menuIndex ? { ...entry, label: e.target.value } : entry,
                      ),
                    )
                  }
                  placeholder="Label"
                />
                <input
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={item.href}
                  onChange={(e) =>
                    setMenuItems((prev) =>
                      prev.map((entry, idx) =>
                        idx === menuIndex ? { ...entry, href: e.target.value } : entry,
                      ),
                    )
                  }
                  placeholder="/path"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
                    value={item.order}
                    onChange={(e) =>
                      setMenuItems((prev) =>
                        prev.map((entry, idx) =>
                          idx === menuIndex ? { ...entry, order: Number(e.target.value) } : entry,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="rounded-md border border-slate-300 px-2 py-2 text-xs font-semibold text-slate-700"
                    onClick={() => addSubMenuItem(menuIndex)}
                  >
                    Add Submenu
                  </button>
                </div>
              </div>

              {(item.children ?? []).length > 0 ? (
                <div className="mt-3 space-y-2 border-l-2 border-slate-200 pl-3">
                  {(item.children ?? []).map((child, childIndex) => (
                    <div key={child.id} className="grid gap-2 md:grid-cols-3">
                      <input
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        value={child.label}
                        onChange={(e) =>
                          setMenuItems((prev) =>
                            prev.map((entry, idx) => {
                              if (idx !== menuIndex) return entry;
                              return {
                                ...entry,
                                children: (entry.children ?? []).map((sub, subIdx) =>
                                  subIdx === childIndex ? { ...sub, label: e.target.value } : sub,
                                ),
                              };
                            }),
                          )
                        }
                        placeholder="Submenu label"
                      />
                      <input
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        value={child.href}
                        onChange={(e) =>
                          setMenuItems((prev) =>
                            prev.map((entry, idx) => {
                              if (idx !== menuIndex) return entry;
                              return {
                                ...entry,
                                children: (entry.children ?? []).map((sub, subIdx) =>
                                  subIdx === childIndex ? { ...sub, href: e.target.value } : sub,
                                ),
                              };
                            }),
                          )
                        }
                        placeholder="/path"
                      />
                      <input
                        type="number"
                        className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
                        value={child.order}
                        onChange={(e) =>
                          setMenuItems((prev) =>
                            prev.map((entry, idx) => {
                              if (idx !== menuIndex) return entry;
                              return {
                                ...entry,
                                children: (entry.children ?? []).map((sub, subIdx) =>
                                  subIdx === childIndex
                                    ? { ...sub, order: Number(e.target.value) }
                                    : sub,
                                ),
                              };
                            }),
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={saveMenu}
          disabled={isSavingMenu}
          className="mt-4 rounded-md bg-[#1e4b75] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSavingMenu ? 'Saving...' : 'Save Menu'}
        </button>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Homepage Content Blocks</h2>
          <button
            type="button"
            onClick={addContentBlock}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            Add Block
          </button>
        </div>

        <div className="space-y-4">
          {contentBlocks.map((block, index) => (
            <div key={block.id} className="grid gap-3 rounded-md border border-slate-200 p-4 md:grid-cols-2">
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={block.title}
                onChange={(e) =>
                  setContentBlocks((prev) =>
                    prev.map((entry, idx) =>
                      idx === index ? { ...entry, title: e.target.value } : entry,
                    ),
                  )
                }
                placeholder="Title"
              />
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={block.href}
                onChange={(e) =>
                  setContentBlocks((prev) =>
                    prev.map((entry, idx) =>
                      idx === index ? { ...entry, href: e.target.value } : entry,
                    ),
                  )
                }
                placeholder="/path"
              />
              <textarea
                className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                rows={3}
                value={block.description}
                onChange={(e) =>
                  setContentBlocks((prev) =>
                    prev.map((entry, idx) =>
                      idx === index ? { ...entry, description: e.target.value } : entry,
                    ),
                  )
                }
                placeholder="Description"
              />
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
                value={block.imageUrl}
                onChange={(e) =>
                  setContentBlocks((prev) =>
                    prev.map((entry, idx) =>
                      idx === index ? { ...entry, imageUrl: e.target.value } : entry,
                    ),
                  )
                }
                placeholder="Image URL (optional)"
              />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={block.enabled}
                    onChange={(e) =>
                      setContentBlocks((prev) =>
                        prev.map((entry, idx) =>
                          idx === index ? { ...entry, enabled: e.target.checked } : entry,
                        ),
                      )
                    }
                  />
                  Enabled
                </label>
                <input
                  type="number"
                  className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={block.order}
                  onChange={(e) =>
                    setContentBlocks((prev) =>
                      prev.map((entry, idx) =>
                        idx === index ? { ...entry, order: Number(e.target.value) } : entry,
                      ),
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={saveContent}
          disabled={isSavingContent}
          className="mt-4 rounded-md bg-[#1e4b75] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSavingContent ? 'Saving...' : 'Save Content Blocks'}
        </button>
      </section>

      {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}

      <div className="border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
