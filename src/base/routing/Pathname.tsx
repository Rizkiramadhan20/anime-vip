"use client";

import React, { useState } from "react";

import { usePathname } from "next/navigation";

import { ThemeProvider } from "@/utils/theme/theme-provider";

import Header from "@/components/layout/Header";

import Sidebar from "@/components/layout/Sidebar";

import { Toaster } from "sonner";

const Pathname = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isAnimeRoute = pathname?.includes("/anime") || pathname?.includes("/manga") || false;

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Toaster
                position="top-center"
                richColors
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'var(--sidebar)',
                        color: 'var(--sidebar-foreground)',
                        border: '1px solid var(--sidebar-border)',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    },
                    className: 'font-medium',
                }}
            />

            {isAnimeRoute ? (
                <div className="flex h-screen bg-[var(--background)] overflow-hidden relative">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--sidebar-primary)] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--sidebar-accent)] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute top-40 left-40 w-80 h-80 bg-[var(--destructive)] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    </div>

                    {/* Sidebar Component */}
                    <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col h-screen overflow-hidden">
                        {/* Header Component */}
                        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

                        {/* Main Content Area */}
                        <div className="flex-1 overflow-y-auto">
                            {children}
                        </div>
                    </main>
                </div>
            ) : (
                <>
                    {children}
                </>
            )}
        </ThemeProvider>
    );
};

export default Pathname;