import { FileSearch } from 'lucide-react';

import { EmptyState, PageHeader } from '@/components/layout';

// Next.js 15 made dynamic route params async. Stub keeps the signature so
// filling this in later means just `await params`, not a type rewrite.
export default function AssetDetailPage(_props: {
	params: Promise<{ id: string }>;
}) {
	return (
		<>
			<PageHeader
				title="Asset Detail"
				description="Detailed view with metrics, history, and related items."
				breadcrumbs={[
					{ label: 'Home', href: '/' },
					{ label: 'Assets', href: '/assets' },
					{ label: 'Detail' },
				]}
			/>
			<EmptyState
				icon={FileSearch}
				title="Detail view coming soon"
				description="Metrics, tags, activity history, and related entities will appear here."
			/>
		</>
	);
}
