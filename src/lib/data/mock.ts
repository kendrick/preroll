import type {
	Activity,
	DataSource,
	Entity,
	EntityDetail,
	Summary,
} from './contracts';

// Deliberate delay so loading states actually show up during development.
// Mock data that resolves synchronously hides every skeleton and Suspense
// fallback, and the first real network call surfaces all the bugs at once.
function simulateLatency<T>(data: T): Promise<T> {
	return new Promise((resolve) => {
		setTimeout(resolve, 300 + Math.random() * 300, data);
	});
}

const entities: Entity[] = [
	{
		id: 'e1',
		name: 'North Ridge Distribution Center',
		status: 'active',
		description: 'Primary distribution hub for the western region.',
		createdAt: '2026-01-12T09:24:00.000Z',
		updatedAt: '2026-05-02T14:11:00.000Z',
	},
	{
		id: 'e2',
		name: 'Project Aurora',
		status: 'pending',
		description: 'Phase-two rollout for the new analytics platform.',
		createdAt: '2026-03-04T15:30:00.000Z',
		updatedAt: '2026-05-01T08:45:00.000Z',
	},
	{
		id: 'e3',
		name: 'Pacific Logistics Hub',
		status: 'active',
		description: 'Pacific coast logistics and fulfillment center.',
		createdAt: '2025-11-21T10:00:00.000Z',
		updatedAt: '2026-04-29T17:20:00.000Z',
	},
	{
		id: 'e4',
		name: 'Meridian Analytics Platform',
		status: 'review',
		description: 'BI platform pending compliance review.',
		createdAt: '2026-02-18T13:45:00.000Z',
		updatedAt: '2026-04-30T11:05:00.000Z',
	},
	{
		id: 'e5',
		name: 'Skyline Tower Renovation',
		status: 'active',
		description: 'Multi-floor office renovation project.',
		createdAt: '2025-09-08T08:00:00.000Z',
		updatedAt: '2026-05-03T09:15:00.000Z',
	},
	{
		id: 'e6',
		name: 'Coastal Energy Initiative',
		status: 'inactive',
		description: 'Renewable energy pilot, currently paused.',
		createdAt: '2025-06-14T12:00:00.000Z',
		updatedAt: '2026-02-12T16:30:00.000Z',
	},
	{
		id: 'e7',
		name: 'Granite Falls Manufacturing',
		status: 'active',
		description: 'Components manufacturing facility, full capacity.',
		createdAt: '2024-11-03T07:30:00.000Z',
		updatedAt: '2026-05-02T10:00:00.000Z',
	},
	{
		id: 'e8',
		name: 'Project Helios',
		status: 'pending',
		description: 'Solar deployment pilot in southern region.',
		createdAt: '2026-04-09T14:20:00.000Z',
		updatedAt: '2026-04-30T13:00:00.000Z',
	},
	{
		id: 'e9',
		name: 'Atlas Cloud Migration',
		status: 'review',
		description: 'Legacy infrastructure migration, in security review.',
		createdAt: '2026-01-30T11:10:00.000Z',
		updatedAt: '2026-05-01T15:25:00.000Z',
	},
	{
		id: 'e10',
		name: 'Westbrook Research Lab',
		status: 'active',
		description: 'R&D facility, three active research streams.',
		createdAt: '2025-08-22T09:00:00.000Z',
		updatedAt: '2026-04-28T14:40:00.000Z',
	},
];

const entitiesById = new Map(entities.map(entity => [entity.id, entity]));

function detail(
	id: string,
	metrics: EntityDetail['metrics'],
	tags: string[],
): EntityDetail {
	const base = entitiesById.get(id);
	if (!base)
		throw new Error(`Mock setup error: no entity with id "${id}".`);
	return { ...base, metrics, tags };
}

const detailedEntities = new Map<string, EntityDetail>([
	[
		'e1',
		detail(
			'e1',
			[
				{ label: 'Throughput', value: '12.4K/day', change: 8.2 },
				{ label: 'Capacity', value: '78%', change: -2.1 },
				{ label: 'On-time rate', value: '96.5%', change: 1.4 },
				{ label: 'Active staff', value: 142 },
			],
			['logistics', 'west', 'priority'],
		),
	],
	[
		'e2',
		detail(
			'e2',
			[
				{ label: 'Tasks complete', value: '64 / 110', change: 12.5 },
				{ label: 'Sprint velocity', value: 38, change: 4.0 },
				{ label: 'Blocked items', value: 5, change: -25.0 },
			],
			['analytics', 'phase-2', 'q2'],
		),
	],
]);

const activities: Activity[] = [
	{
		id: 'a1',
		entityId: 'e1',
		action: 'updated capacity report',
		actor: 'Alex Chen',
		timestamp: '2026-05-03T16:42:00.000Z',
	},
	{
		id: 'a2',
		entityId: 'e2',
		action: 'closed sprint backlog item',
		actor: 'Priya Patel',
		timestamp: '2026-05-03T14:08:00.000Z',
	},
	{
		id: 'a3',
		entityId: 'e5',
		action: 'submitted milestone for review',
		actor: 'Maya Johansson',
		timestamp: '2026-05-03T11:30:00.000Z',
	},
	{
		id: 'a4',
		entityId: 'e1',
		action: 'flagged inventory variance',
		actor: 'Daniel Okafor',
		timestamp: '2026-05-02T22:15:00.000Z',
	},
	{
		id: 'a5',
		entityId: 'e4',
		action: 'requested compliance feedback',
		actor: 'Sara Lindqvist',
		timestamp: '2026-05-02T18:00:00.000Z',
	},
	{
		id: 'a6',
		entityId: 'e9',
		action: 'completed phase-1 cutover',
		actor: 'Alex Chen',
		timestamp: '2026-05-02T13:25:00.000Z',
	},
	{
		id: 'a7',
		entityId: 'e3',
		action: 'commented on routing plan',
		actor: 'Lina Hernandez',
		timestamp: '2026-05-01T17:48:00.000Z',
	},
	{
		id: 'a8',
		entityId: 'e7',
		action: 'archived Q1 incident report',
		actor: 'Tom Becker',
		timestamp: '2026-05-01T10:30:00.000Z',
	},
	{
		id: 'a9',
		entityId: 'e2',
		action: 'reassigned story owner',
		actor: 'Priya Patel',
		timestamp: '2026-04-30T15:42:00.000Z',
	},
	{
		id: 'a10',
		entityId: 'e8',
		action: 'created RFP draft',
		actor: 'Jamal Reyes',
		timestamp: '2026-04-30T09:11:00.000Z',
	},
	{
		id: 'a11',
		entityId: 'e10',
		action: 'logged research entry #482',
		actor: 'Maya Johansson',
		timestamp: '2026-04-29T19:00:00.000Z',
	},
	{
		id: 'a12',
		entityId: 'e1',
		action: 'approved schedule shift',
		actor: 'Lina Hernandez',
		timestamp: '2026-04-29T13:14:00.000Z',
	},
	{
		id: 'a13',
		entityId: 'e4',
		action: 'updated risk matrix',
		actor: 'Sara Lindqvist',
		timestamp: '2026-04-28T20:50:00.000Z',
	},
	{
		id: 'a14',
		entityId: 'e6',
		action: 'paused vendor agreement',
		actor: 'Tom Becker',
		timestamp: '2026-04-28T14:20:00.000Z',
	},
	{
		id: 'a15',
		entityId: 'e2',
		action: 'opened follow-up ticket',
		actor: 'Daniel Okafor',
		timestamp: '2026-04-27T11:00:00.000Z',
	},
];

const summaries: Summary[] = [
	{
		label: 'Total Assets',
		value: 47,
		change: 8.2,
		trend: [38, 41, 42, 43, 45, 44, 46, 47],
	},
	{
		label: 'Active Projects',
		value: 12,
		change: 12.5,
		trend: [9, 10, 10, 11, 11, 11, 12, 12],
	},
	{
		label: 'Completion Rate',
		value: '87%',
		change: -2.1,
		trend: [89, 90, 88, 88, 87, 88, 86, 87],
	},
	{
		label: 'Open Issues',
		value: 23,
		change: -14.3,
		trend: [31, 30, 28, 27, 26, 25, 24, 23],
	},
	{
		label: 'Monthly Revenue',
		value: '$284K',
		change: 5.7,
		trend: [248, 252, 261, 264, 269, 275, 281, 284],
	},
];

export const mockDataSource: DataSource = {
	getEntities: () => simulateLatency(entities),
	getEntityById: id => simulateLatency(detailedEntities.get(id) ?? null),
	getActivities: entityId =>
		simulateLatency(
			entityId
				? activities.filter(activity => activity.entityId === entityId)
				: activities,
		),
	getSummaries: () => simulateLatency(summaries),
};
