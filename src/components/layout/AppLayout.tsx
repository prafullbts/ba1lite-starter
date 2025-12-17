import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({
  children,
  title
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-[90%] mx-auto py-6">
        {title && (
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-[#01426A]">{title}</h1>
          </header>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}