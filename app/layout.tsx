import React from 'react';
import { AmbientBackground } from '../components/AmbientBackground';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
