'use client';

import type { ReactNode } from 'react';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface ColumnDef<T> {
	key: keyof T & string;
	header: string;
	sortable?: boolean;
	render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface DataTableProps<T> {
	data: T[];
	columns: ColumnDef<T>[];
	searchable?: boolean;
	onRowClick?: (row: T) => void;
	emptyMessage?: string;
	loading?: boolean;
	className?: string;
}

type SortDir = 'asc' | 'desc' | null;

export function DataTable<T>({
	data,
	columns,
	searchable = false,
	onRowClick,
	emptyMessage = 'No results.',
	loading = false,
	className,
}: DataTableProps<T>) {
	const [sortKey, setSortKey] = useState<(keyof T & string) | null>(null);
	const [sortDir, setSortDir] = useState<SortDir>(null);
	const [query, setQuery] = useState('');

	const filtered = useMemo(() => {
		if (!searchable || !query.trim())
			return data;
		const needle = query.trim().toLowerCase();
		return data.filter((row) => {
			for (const value of Object.values(row as Record<string, unknown>)) {
				if (typeof value === 'string' && value.toLowerCase().includes(needle))
					return true;
			}
			return false;
		});
	}, [data, query, searchable]);

	const sorted = useMemo(() => {
		if (!sortKey || !sortDir)
			return filtered;
		const copy = [...filtered];
		copy.sort((a, b) => {
			const av = a[sortKey];
			const bv = b[sortKey];
			const cmp = compareValues(av, bv);
			return sortDir === 'asc' ? cmp : -cmp;
		});
		return copy;
	}, [filtered, sortKey, sortDir]);

	function toggleSort(key: keyof T & string) {
		if (sortKey !== key) {
			setSortKey(key);
			setSortDir('asc');
			return;
		}
		if (sortDir === 'asc') {
			setSortDir('desc');
			return;
		}
		if (sortDir === 'desc') {
			setSortKey(null);
			setSortDir(null);
			return;
		}
		setSortDir('asc');
	}

	const clickable = Boolean(onRowClick);

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			{searchable
				? (
						<div className="relative w-full max-w-sm">
							<SearchIcon
								aria-hidden="true"
								className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								type="search"
								value={query}
								onChange={event => setQuery(event.target.value)}
								placeholder="Search..."
								className="pl-8"
								aria-label="Search table"
							/>
						</div>
					)
				: null}
			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => {
								const isActive = sortKey === column.key;
								const ariaSort = !isActive
									? 'none'
									: sortDir === 'asc'
										? 'ascending'
										: sortDir === 'desc'
											? 'descending'
											: 'none';
								return (
									<TableHead
										key={column.key}
										aria-sort={column.sortable ? ariaSort : undefined}
									>
										{column.sortable
											? (
													<button
														type="button"
														onClick={() => toggleSort(column.key)}
														className="-mx-2 flex items-center gap-1 rounded-md px-2 py-1 hover:bg-muted"
													>
														<span>{column.header}</span>
														<SortIndicator active={isActive} dir={sortDir} />
													</button>
												)
											: (
													<span>{column.header}</span>
												)}
									</TableHead>
								);
							})}
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading
							? renderSkeletonRows(columns.length)
							: sorted.length === 0
								? (
										<TableRow>
											<TableCell
												colSpan={columns.length}
												className="h-24 text-center text-muted-foreground"
											>
												{emptyMessage}
											</TableCell>
										</TableRow>
									)
								: (
										sorted.map((row, rowIndex) => (
											<TableRow
												// eslint-disable-next-line react/no-array-index-key
												key={rowIndex}
												onClick={
													clickable ? () => onRowClick?.(row) : undefined
												}
												onKeyDown={
													clickable
														? (event) => {
																if (event.key === 'Enter' || event.key === ' ') {
																	event.preventDefault();
																	onRowClick?.(row);
																}
															}
														: undefined
												}
												tabIndex={clickable ? 0 : undefined}
												className={cn(clickable && 'cursor-pointer')}
											>
												{columns.map((column) => {
													const value = row[column.key];
													return (
														<TableCell key={column.key}>
															{column.render
																? column.render(value, row)
																: renderPrimitive(value)}
														</TableCell>
													);
												})}
											</TableRow>
										))
									)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
	if (!active || !dir) {
		return (
			<ArrowUpDownIcon
				aria-hidden="true"
				className="size-3.5 text-muted-foreground"
			/>
		);
	}
	const Icon = dir === 'asc' ? ArrowUpIcon : ArrowDownIcon;
	return <Icon aria-hidden="true" className="size-3.5" />;
}

function renderSkeletonRows(columnCount: number) {
	return Array.from({ length: 5 }, (_, rowIndex) => (
		<TableRow key={`skeleton-${rowIndex}`}>
			{Array.from({ length: columnCount }, (__, cellIndex) => (
				<TableCell key={`skeleton-${rowIndex}-${cellIndex}`}>
					<Skeleton className="h-4 w-full max-w-32" />
				</TableCell>
			))}
		</TableRow>
	));
}

function renderPrimitive(value: unknown): ReactNode {
	if (value === null || value === undefined)
		return null;
	if (
		typeof value === 'string'
		|| typeof value === 'number'
		|| typeof value === 'boolean'
	) {
		return String(value);
	}
	return null;
}

function compareValues(a: unknown, b: unknown): number {
	if (a === b)
		return 0;
	if (a === null || a === undefined)
		return -1;
	if (b === null || b === undefined)
		return 1;
	if (typeof a === 'number' && typeof b === 'number')
		return a - b;
	if (a instanceof Date && b instanceof Date)
		return a.getTime() - b.getTime();
	return String(a).localeCompare(String(b));
}
