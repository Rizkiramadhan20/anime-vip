import React from 'react'

import VerifyLayout from "@/hooks/auth/verify-email/VerifyLayout"

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Verify Email',
    description: 'Verify Email',
}

export default function page() {
    return (
        <VerifyLayout />
    )
}
