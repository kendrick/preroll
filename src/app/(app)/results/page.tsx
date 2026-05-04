import { BarChart3 } from 'lucide-react';

import { EmptyState, PageHeader } from '@/components/layout';

export default function ResultsPage() {
	return (
		<>
			<PageHeader
				title="Results"
				description="Analysis output and recommendations."
				breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Results' }]}
			/>
			<EmptyState
				icon={BarChart3}
				title="Results coming soon"
				description="Charts, ranked recommendations, and exportable reports will appear here."
			/>
		</>
	);
}
