import { LayoutDashboard } from 'lucide-react';

import { EmptyState, PageHeader } from '@/components/layout';

export default function DashboardPage() {
	return (
		<>
			<PageHeader
				title="Dashboard"
				description="Overview of key metrics and recent activity."
			/>
			<EmptyState
				icon={LayoutDashboard}
				title="Dashboard coming soon"
				description="KPIs, charts, and activity feed will appear here."
			/>
		</>
	);
}
