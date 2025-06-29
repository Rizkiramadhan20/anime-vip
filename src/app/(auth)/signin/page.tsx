import React from 'react'

import SigninLayout from "@/hooks/auth/signin/SigninLayout"

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign In',
}

export default function page() {
    return (
        <SigninLayout />
    )
}
