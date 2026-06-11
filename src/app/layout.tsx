import type { Metadata } from 'next';
import QueryProvider from './providers/QueryProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Online Coffee Shop | Premium Coffee Beans',
  description: 'Best coffee beans at best prices. Quality & authenticity guaranteed.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}