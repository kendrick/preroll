/**
 * Data layer contracts.
 *
 * Replace these starter interfaces with your client's domain entities. Update
 * mock.ts to match. Components consuming the typed hooks will automatically
 * reflect the new shapes.
 */

export type EntityStatus = 'active' | 'pending' | 'inactive' | 'review';

export interface Entity {
	id: string;
	name: string;
	status: EntityStatus;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface EntityMetric {
	label: string;
	value: string | number;
	change?: number;
}

export interface EntityDetail extends Entity {
	metrics: EntityMetric[];
	tags: string[];
}

export interface Activity {
	id: string;
	entityId: string;
	action: string;
	actor: string;
	timestamp: string;
}

export interface Summary {
	label: string;
	value: string | number;
	change: number;
	trend: number[];
}

export interface DataSource {
	getEntities: () => Promise<Entity[]>;
	getEntityById: (id: string) => Promise<EntityDetail | null>;
	getActivities: (entityId?: string) => Promise<Activity[]>;
	getSummaries: () => Promise<Summary[]>;
}
