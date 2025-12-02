import type { Metadata } from 'next';
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AppInitializer from '@/components/AppInitializer';

export const metadata: Metadata = {
  title: 'ClassPicker',
  description: 'A simple and efficient random picker.',
  applicationName: 'ClassPicker',
  appleWebApp: {
    capable: true,
    title: 'ClassPicker',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#F59E0B',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
            <body className={cn("font-sans antialiased")}>
                <LanguageProvider>
                    <AppInitializer />
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
