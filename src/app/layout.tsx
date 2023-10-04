import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import type { AppProps } from 'next/app'

import React, { ReactNode } from 'react'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pearl Lingo',
  description: 'Next generation language learning platform',
}

export default function RootLayout({ children, pageProps }: AppProps & { children: ReactNode }) {
  return (
    <html lang="en" className='w-screen overflow-x-hidden'>
        <body className={inter.className}>{children}</body>
    </html>
  )
}
