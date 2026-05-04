import type { ReactNode } from 'react';
import Link from 'next/link';
import { Fragment } from 'react';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

export interface PageHeaderCrumb {
	label: string;
	href?: string;
}

export interface PageHeaderProps {
	title: string;
	description?: string;
	breadcrumbs?: PageHeaderCrumb[];
	actions?: ReactNode;
	bordered?: boolean;
	className?: string;
}

export function PageHeader({
	title,
	description,
	breadcrumbs,
	actions,
	bordered = false,
	className,
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				'flex flex-col gap-4 pb-6',
				bordered && 'border-b',
				className,
			)}
		>
			{breadcrumbs && breadcrumbs.length > 0
				? (
						<Breadcrumb>
							<BreadcrumbList>
								{breadcrumbs.map((crumb, index) => {
									const isLast = index === breadcrumbs.length - 1;
									return (
										<Fragment key={crumb.href ?? crumb.label}>
											<BreadcrumbItem>
												{isLast || !crumb.href
													? <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
													: (
															<BreadcrumbLink asChild>
																<Link href={crumb.href}>{crumb.label}</Link>
															</BreadcrumbLink>
														)}
											</BreadcrumbItem>
											{!isLast ? <BreadcrumbSeparator /> : null}
										</Fragment>
									);
								})}
							</BreadcrumbList>
						</Breadcrumb>
					)
				: null}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
				<div className="flex flex-col gap-1">
					<h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">
						{title}
					</h1>
					{description
						? <p className="text-sm text-muted-foreground">{description}</p>
						: null}
				</div>
				{actions
					? (
							<div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end">
								{actions}
							</div>
						)
					: null}
			</div>
		</div>
	);
}
