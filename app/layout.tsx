// Use 'use client' for client-side-only logic, but keep the layout itself a Server Component.
'use client'; 

import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { inter, ebGaramond, jetbrainsMono } from "@/lib/fonts";

// A new component to handle client-side effects after the language is ready.
function AppInitializer({ children }: { children: React.ReactNode }) {
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

        // Service Worker registration can also be here.
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => console.log("Service Worker registered.", reg))
                .catch((err) => console.log("Service Worker registration failed: ", err));
        }
    }, [language, t]);

    // This component doesn't render anything itself, it just runs effects.
    return <>{children}</>;
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // The HTML and BODY tags are the best place to apply font variables.
        <html lang="en" suppressHydrationWarning className={cn(inter.variable, ebGaramond.variable, jetbrainsMono.variable)}>
            <body>
                <LanguageProvider>
                    {/* The Initializer wraps the children to get access to the language context. */}
                    <AppInitializer>
                        <main className={cn("font-sans antialiased")}>
                            {children}
                        </main>
                    </AppInitializer>
                </LanguageProvider>
            </body>
        </html>
    );
}
