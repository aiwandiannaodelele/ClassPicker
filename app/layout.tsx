'use client'
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import Head from "next/head";

function AppLayout({ children }: { children: React.ReactNode }) {
    const { language, t } = useLanguage();

    useEffect(() => {
        document.documentElement.lang = language;
        document.title = t('title');

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('SW registered: ', registration);
                }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
            });
        }
    }, [language, t]);

    return (
        <>
            <Head>
                <meta name="application-name" content="ClassPicker" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="ClassPicker" />
                <meta name="description" content="A simple and efficient random picker." />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-TileColor" content="#F59E0B" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#F59E0B" />

                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <html lang={language} suppressHydrationWarning>
                <body className={cn("font-sans antialiased")}>
                    {children}
                </body>
            </html>
        </>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <LanguageProvider>
            <AppLayout>{children}</AppLayout>
        </LanguageProvider>
    );
}
