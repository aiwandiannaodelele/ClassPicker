'use client'
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

function AppLayout({ children }: { children: React.ReactNode }) {
    const { language, t } = useLanguage();

    useEffect(() => {
        document.documentElement.lang = language;
        document.title = t('title');

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => console.log("Service Worker registered.", reg))
                .catch((err) => console.log("Service Worker registration failed: ", err));
        }
    }, [language, t]);

    return (
        <html lang={language} suppressHydrationWarning>
            <body className={cn("font-sans antialiased")}>
                {children}
            </body>
        </html>
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
