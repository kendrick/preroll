import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: ReactNode;
	className?: string;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				'mx-auto flex w-full max-w-md flex-col items-center justify-center px-6 py-12 text-center',
				className,
			)}
		>
			{Icon
				? (
						<Icon
							aria-hidden="true"
							className="mb-4 size-10 text-muted-foreground"
						/>
					)
				: null}
			<h3 className="font-heading text-base font-semibold text-foreground">
				{title}
			</h3>
			{description
				? (
						<p className="mt-1 text-sm text-muted-foreground">{description}</p>
					)
				: null}
			{action ? <div className="mt-6">{action}</div> : null}
		</div>
	);
}
