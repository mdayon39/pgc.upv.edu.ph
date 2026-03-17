'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    
    // In a real scenario, you'd use a server action or an API route.
    // For now, we'll simulate success. To make it work for real on Vercel,
    // the user can simply plug in a Formspree ID or a simple POST route.
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <h3 className="text-xl font-bold text-green-800">Message Sent!</h3>
        <p className="mt-2 text-green-700">Thank you for contacting PGC Visayas. We will get back to you soon.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm font-semibold text-green-800 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-bold text-slate-700">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Juan Dela Cruz"
          className="rounded border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1e4b75] focus:outline-none"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="juan@example.com"
          className="rounded border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1e4b75] focus:outline-none"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="subject" className="text-sm font-bold text-slate-700">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="Inquiry about sequencing services"
          className="rounded border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1e4b75] focus:outline-none"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-bold text-slate-700">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="How can we help you?"
          className="rounded border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1e4b75] focus:outline-none"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-2 rounded bg-[#235787] py-3 text-sm font-bold text-white shadow hover:bg-[#1e4b75] disabled:opacity-50 transition-colors"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
