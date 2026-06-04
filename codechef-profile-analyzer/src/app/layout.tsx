import './globals.css'; // Standard Next.js tailwind setup import
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CodeChef Profile Analyzer',
  description: 'Deep analytical insights into your CodeChef performance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
