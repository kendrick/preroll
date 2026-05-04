import { Box } from 'lucide-react';

import { EmptyState, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';

export default function AssetsPage() {
	return (
		<>
			<PageHeader
				title="Assets"
				description="Browse and manage all assets."
				breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Assets' }]}
				actions={<Button>Add Asset</Button>}
			/>
			<EmptyState
				icon={Box}
				title="No assets yet"
				description="Asset data table with search and filtering will appear here."
				action={<Button variant="outline">Import Assets</Button>}
			/>
		</>
	);
}
