import type { ReactNode } from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface ChartShellProps {
	title: string;
	description?: string;
	loading?: boolean;
	empty?: boolean;
	height?: number;
	className?: string;
	children: ReactNode;
}

export function ChartShell({
	title,
	description,
	loading = false,
	empty = false,
	height = 300,
	className,
	children,
}: ChartShellProps) {
	return (
		<Card className={cn(className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description ? <CardDescription>{description}</CardDescription> : null}
			</CardHeader>
			<CardContent>
				{loading
					? (
							<Skeleton className="w-full rounded-md" style={{ height }} />
						)
					: empty
						? (
								<div
									className="flex w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground"
									style={{ height }}
								>
									No data available
								</div>
							)
						: (
								<div className="w-full" style={{ height }}>
									{children}
								</div>
							)}
			</CardContent>
		</Card>
	);
}
