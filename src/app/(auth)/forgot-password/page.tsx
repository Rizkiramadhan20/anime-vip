import React from 'react'

import ForgotLayout from "@/hooks/auth/forgot-password/ForgotLayout"

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Forgot Password',
    description: 'Forgot Password',
}

export default function page() {
    return (
        <ForgotLayout />
    )
}
