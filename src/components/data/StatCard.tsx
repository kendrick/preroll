import type { LucideIcon } from 'lucide-react';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface StatCardChange {
	value: number;
	label?: string;
}

export interface StatCardProps {
	label: string;
	value: string | number;
	change?: StatCardChange;
	icon?: LucideIcon;
	loading?: boolean;
	className?: string;
}

export function StatCard({
	label,
	value,
	change,
	icon: Icon,
	loading = false,
	className,
}: StatCardProps) {
	return (
		<Card className={cn('h-full', className)}>
			<CardHeader>
				<div className="flex items-start justify-between gap-2">
					<span className="text-sm font-medium text-muted-foreground">
						{label}
					</span>
					{Icon
						? (
								<Icon
									aria-hidden="true"
									className="size-4 shrink-0 text-muted-foreground"
								/>
							)
						: null}
				</div>
			</CardHeader>
			<CardContent>
				{loading
					? (
							<div className="flex flex-col gap-2">
								<Skeleton className="h-8 w-24" />
								<Skeleton className="h-4 w-32" />
							</div>
						)
					: (
							<div className="flex flex-col gap-1">
								<span className="font-heading text-3xl font-bold tracking-tight">
									{value}
								</span>
								{change ? <StatChange change={change} /> : null}
							</div>
						)}
			</CardContent>
		</Card>
	);
}

function StatChange({ change }: { change: StatCardChange }) {
	const direction
		= change.value > 0 ? 'up' : change.value < 0 ? 'down' : 'flat';
	const Icon
		= direction === 'up'
			? ArrowUpIcon
			: direction === 'down'
				? ArrowDownIcon
				: ArrowRightIcon;
	const tone
		= direction === 'up'
			? 'text-emerald-600 dark:text-emerald-400'
			: direction === 'down'
				? 'text-destructive'
				: 'text-muted-foreground';
	const formatted = `${change.value > 0 ? '+' : ''}${change.value}%`;

	return (
		<div className={cn('flex items-center gap-1 text-xs font-medium', tone)}>
			<Icon aria-hidden="true" className="size-3.5" />
			<span>{formatted}</span>
			{change.label
				? (
						<span className="text-muted-foreground">
							{change.label}
						</span>
					)
				: null}
		</div>
	);
}
