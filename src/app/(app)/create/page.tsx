import { PlusCircle } from 'lucide-react';

import { EmptyState, PageHeader } from '@/components/layout';

export default function CreatePage() {
	return (
		<>
			<PageHeader
				title="Create New"
				description="Step through the creation workflow."
				breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Create' }]}
			/>
			<EmptyState
				icon={PlusCircle}
				title="Creation form coming soon"
				description="A multi-step form or wizard for creating new entities will appear here."
			/>
		</>
	);
}
