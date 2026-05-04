'use client';

// Client component because navigation items hold Lucide icon component
// references. Server components can't serialize functions across to AppShell
// (a client component). Children remain server-rendered and pass through.

import type { AppShellNavItem } from '@/components/layout';
import type { ReactNode } from 'react';

import process from 'node:process';

import { AppShell } from '@/components/layout';
import {
	Activity,
	BarChart3,
	Box,
	LayoutDashboard,
	PlusCircle,
} from 'lucide-react';

// Single seam where navigation is defined. Each engagement renames these
// labels and icons to match the client's domain language. Keeping nav out
// of AppShell is what lets the shell stay generic across prototypes.
const navigation: AppShellNavItem[] = [
	{ label: 'Dashboard', href: '/', icon: LayoutDashboard },
	{ label: 'Assets', href: '/assets', icon: Box },
	{ label: 'Activity', href: '/activity', icon: Activity },
	{ label: 'Create', href: '/create', icon: PlusCircle },
	{ label: 'Results', href: '/results', icon: BarChart3 },
];

const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME ?? 'Prototype';

export default function AppGroupLayout({ children }: { children: ReactNode }) {
	return (
		<AppShell
			navigation={navigation}
			brand={
				<span className="font-heading text-base font-semibold">
					{clientName}
				</span>
			}
		>
			{children}
		</AppShell>
	);
}
