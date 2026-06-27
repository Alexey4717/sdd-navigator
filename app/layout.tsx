import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SDD Navigator Dashboard',
  description: 'Specification coverage dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
