"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 bg-secondary/20 dark:bg-secondary/10 rounded-xl border border-border w-fit sm:w-auto max-w-full">
            {[{ label: 'Light', value: 'light', icon: Sun }, { label: 'Dark', value: 'dark', icon: Moon }].map(({ label, value, icon: Icon }) => {
                const active = theme === value;
                return (
                    <motion.button
                        key={value}
                        whileInView={{ scale: [0.9, 1] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className={`relative flex items-center gap-1 sm:gap-2 px-2 py-2 sm:px-3 rounded-lg text-sm font-medium transition-colors duration-200 capitalize cursor-pointer ${active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        style={{ minWidth: 40 }}
                        onClick={() => setTheme(value)}
                        aria-label={label + ' mode'}
                    >
                        {active && (
                            <motion.div
                                layoutId="activeThemeMode"
                                className="absolute inset-0 bg-primary rounded-lg z-0"
                                initial={false}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <Icon className="relative z-10 h-[1.2rem] w-[1.2rem]" />
                        <span className="relative z-10 hidden xs:inline sm:inline">{label}</span>
                        <span className="sr-only">{label} mode</span>
                    </motion.button>
                )
            })}
        </div>
    )
}
