import type { Metadata } from 'next';
import process from 'node:process';
import { Inter } from 'next/font/google';

import { DataProvider } from '@/lib/data';
import { cn } from '@/lib/utils';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME ?? 'Prototype';

export const metadata: Metadata = {
	title: clientName,
	description: 'Accelerated prototype',
};

// AppShell lives in (app)/layout.tsx, not here. Future routes outside that
// group (auth, marketing, public-facing pages) can opt out of the chrome
// without restructuring this file.
export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={cn('h-full antialiased', 'font-sans', inter.variable)}>
			<body className="flex min-h-full flex-col">
				<DataProvider>{children}</DataProvider>
			</body>
		</html>
	);
}
