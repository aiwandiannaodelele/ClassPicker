'use client'
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

function AppLayout({ children }: { children: React.ReactNode }) {
    const { language } = useLanguage();

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    return (
        <html lang={language}>
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
