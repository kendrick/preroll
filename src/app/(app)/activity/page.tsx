import { Activity } from 'lucide-react';

import { EmptyState, PageHeader } from '@/components/layout';

export default function ActivityPage() {
	return (
		<>
			<PageHeader
				title="Activity"
				description="Recent actions and events across the system."
				breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Activity' }]}
			/>
			<EmptyState
				icon={Activity}
				title="No recent activity"
				description="A chronological feed of actions, updates, and events will appear here."
			/>
		</>
	);
}
