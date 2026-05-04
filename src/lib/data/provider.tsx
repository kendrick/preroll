'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import { DataContext } from './context';
import { dataSource } from './source';

export { DataContext } from './context';

export function DataProvider({ children }: { children: ReactNode }) {
	return <DataContext value={dataSource}>{children}</DataContext>;
}

export interface DataBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

export function DataBoundary({ children, fallback }: DataBoundaryProps) {
	return (
		<Suspense fallback={fallback ?? <DefaultFallback />}>{children}</Suspense>
	);
}

function DefaultFallback() {
	return (
		<div
			className="flex w-full flex-col gap-3"
			aria-busy="true"
			aria-live="polite"
		>
			<Skeleton className="h-6 w-1/3" />
			<Skeleton className="h-4 w-2/3" />
			<Skeleton className="h-4 w-1/2" />
		</div>
	);
}
