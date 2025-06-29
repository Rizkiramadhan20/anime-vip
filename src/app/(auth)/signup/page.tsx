import React from 'react'

import SignupLayout from "@/hooks/auth/signup/SignupLayout"

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Sign Up',
}

export default function page() {
    return (
        <SignupLayout />
    )
}
