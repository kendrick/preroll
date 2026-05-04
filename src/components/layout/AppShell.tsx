'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface AppShellNavItem {
	label: string;
	href: string;
	icon?: LucideIcon;
	badge?: string;
}

export interface AppShellProps {
	navigation: AppShellNavItem[];
	brand?: ReactNode;
	footer?: ReactNode;
	defaultOpen?: boolean;
	className?: string;
	children: ReactNode;
}

export function AppShell({
	navigation,
	brand,
	footer,
	defaultOpen = true,
	className,
	children,
}: AppShellProps) {
	const pathname = usePathname();

	return (
		<TooltipProvider>
			<SidebarProvider defaultOpen={defaultOpen}>
				<Sidebar collapsible="icon">
					{brand
						? (
								<SidebarHeader>
									<div className="flex min-h-9 items-center gap-2 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
										{brand}
									</div>
								</SidebarHeader>
							)
						: null}
					<SidebarContent>
						<SidebarGroup>
							<SidebarMenu>
								{navigation.map((item) => {
									const Icon = item.icon;
									const isActive = isPathActive(pathname, item.href);
									return (
										<SidebarMenuItem key={item.href}>
											<SidebarMenuButton
												asChild
												isActive={isActive}
												tooltip={item.label}
											>
												<Link href={item.href}>
													{Icon ? <Icon /> : null}
													<span>{item.label}</span>
												</Link>
											</SidebarMenuButton>
											{item.badge
												? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
												: null}
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroup>
					</SidebarContent>
					{footer
						? (
								<SidebarFooter>
									<div className="flex flex-col gap-2 px-1 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
										{footer}
									</div>
								</SidebarFooter>
							)
						: null}
				</Sidebar>
				<SidebarInset>
					<header className="flex h-14 items-center gap-2 border-b px-4 md:px-6">
						<SidebarTrigger />
						<Separator orientation="vertical" className="h-5" />
					</header>
					<main
						className={cn(
							'flex-1',
							className,
						)}
					>
						<div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
							{children}
						</div>
					</main>
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}

function isPathActive(pathname: string | null, href: string) {
	if (!pathname)
		return false;
	if (href === '/')
		return pathname === '/';
	return pathname === href || pathname.startsWith(`${href}/`);
}
