"use client";

import React from "react";

import { usePathname } from "next/navigation";

import { ThemeProvider } from "@/utils/theme/theme-provider"

// import Header from "@/components/layout/Header/Header";

// import Footer from "@/components/layout/Footer/Footer";

import { Toaster } from "sonner";

const Pathname = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isAdminRoute =
        pathname?.includes("/signin") ||
        pathname?.includes("/signup") ||
        pathname?.includes("/forgot-password") ||
        pathname?.includes("/profile") ||
        pathname?.includes("/dashboard") || false;

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
                        background: 'black',
                        color: '#fff',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    },
                    className: 'font-medium',
                }}
            />
            {/* {!isAdminRoute && <Header />} */}
            {children}
            {/* {!isAdminRoute && <Footer />} */}
        </ThemeProvider>

    );
};

export default Pathname;