import Head from 'next/head';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Botho University GPA Calculator</title>
        <meta
          name="description"
          content="Privacy-first GPA and CGPA calculator for Botho University students."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-bu-cream font-dmsans text-slate-900">
        <header className="relative overflow-hidden bg-gradient-to-br from-bu-navy via-[#223763] to-bu-teal px-4 py-8 sm:px-8">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full border border-bu-gold/30" />
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full border border-bu-gold/20" />
            <div className="absolute bottom-8 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full border border-white/10" />
          </div>

          <div className="relative mx-auto max-w-6xl">
            <div className="mb-6 h-1.5 w-28 rounded-full bg-bu-gold" />
            <p className="text-sm uppercase tracking-[0.2em] text-bu-gold">Botho University</p>
            <h1 className="mt-2 font-sora text-3xl font-bold text-white sm:text-5xl">
              Calculate Your CGPA Instantly
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              100% browser-based, private, and tailored for Botho University programme structures.
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</main>

        <footer className="border-t border-slate-300 bg-white px-4 py-4 text-sm text-slate-700 sm:px-8">
          <p className="mx-auto max-w-6xl">
            Your data never leaves your browser. No information is sent to any server. All calculations are
            performed locally on your device.
          </p>
        </footer>
      </div>
    </>
  );
}
