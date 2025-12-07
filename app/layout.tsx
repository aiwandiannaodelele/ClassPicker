'use client'
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

function AppLayout({ children }: { children: React.ReactNode }) {
    const { language, t } = useLanguage();

    useEffect(() => {
        const newTitle = t('title');
        
        // Set web page title
        document.documentElement.lang = language;
        document.title = newTitle;

        // Set Tauri window title if in Tauri environment
        if (window.__TAURI__?.window) {
            const appWindow = window.__TAURI__.window.getCurrentWindow();
            appWindow.setTitle(newTitle);
        }

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
