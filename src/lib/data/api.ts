import type {
	Activity,
	DataSource,
	Entity,
	EntityDetail,
	Summary,
} from './contracts';

import process from 'node:process';

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

// Returns the fallback instead of throwing. In a prototype, a 500 mid-demo
// that crashes the page is worse than an empty state nobody asks about.
async function request<T>(path: string, fallback: T): Promise<T> {
	if (!baseUrl) {
		console.error(
			`[data/api] NEXT_PUBLIC_API_URL is not set; cannot fetch "${path}".`,
		);
		return fallback;
	}
	try {
		const response = await fetch(`${baseUrl}${path}`, {
			headers: { Accept: 'application/json' },
		});
		if (!response.ok) {
			console.error(
				`[data/api] ${path} failed: ${response.status} ${response.statusText}`,
			);
			return fallback;
		}
		return (await response.json()) as T;
	}
	catch (error) {
		console.error(`[data/api] ${path} threw:`, error);
		return fallback;
	}
}

export const apiDataSource: DataSource = {
	getEntities: () => request<Entity[]>('/entities', []),
	getEntityById: id =>
		request<EntityDetail | null>(`/entities/${encodeURIComponent(id)}`, null),
	getActivities: (entityId) => {
		const path
			= entityId
				? `/activities?entityId=${encodeURIComponent(entityId)}`
				:	'/activities';
		return request<Activity[]>(path, []);
	},
	getSummaries: () => request<Summary[]>('/summaries', []),
};
