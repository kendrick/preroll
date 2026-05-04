'use client';

import type {
	Activity,
	DataSource,
	Entity,
	EntityDetail,
	Summary,
} from './contracts';

import { use, useEffect, useRef, useState } from 'react';
import { DataContext } from './context';

const UNSET = Symbol('unset');

export interface QueryOptions {
	enabled?: boolean;
}

export interface QueryResult<T> {
	data: T;
	loading: boolean;
	error: Error | null;
}

export function useDataSource(): DataSource {
	const ctx = use(DataContext);
	if (!ctx) {
		throw new Error(
			'useDataSource must be used within a <DataProvider>. '
			+ 'Wrap your app in <DataProvider> in the root layout.',
		);
	}
	return ctx;
}

function toError(value: unknown): Error {
	return value instanceof Error ? value : new Error(String(value));
}

export function useEntities({ enabled = true }: QueryOptions = {}): QueryResult<
	Entity[]
> {
	const ds = useDataSource();
	const [data, setData] = useState<Entity[]>([]);
	const [loading, setLoading] = useState<boolean>(enabled);
	const [error, setError] = useState<Error | null>(null);
	const fetchedRef = useRef(false);

	useEffect(() => {
		if (!enabled) {
			setLoading(false);
			return;
		}
		if (fetchedRef.current)
			return;
		fetchedRef.current = true;

		let cancelled = false;
		setError(null);
		ds.getEntities()
			.then((result) => {
				if (cancelled)
					return;
				setData(result);
				setLoading(false);
			})
			.catch((err: unknown) => {
				if (cancelled)
					return;
				setError(toError(err));
				setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [ds, enabled]);

	return { data, loading, error };
}

export function useEntity(
	id: string,
	{ enabled = true }: QueryOptions = {},
): QueryResult<EntityDetail | null> {
	const ds = useDataSource();
	const [data, setData] = useState<EntityDetail | null>(null);
	const [loading, setLoading] = useState<boolean>(enabled);
	const [error, setError] = useState<Error | null>(null);
	const lastIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (!enabled) {
			setLoading(false);
			return;
		}
		if (lastIdRef.current === id)
			return;
		const isFirstRun = lastIdRef.current === null;
		lastIdRef.current = id;

		let cancelled = false;
		if (!isFirstRun)
			setLoading(true);
		setError(null);
		ds.getEntityById(id)
			.then((result) => {
				if (cancelled)
					return;
				setData(result);
				setLoading(false);
			})
			.catch((err: unknown) => {
				if (cancelled)
					return;
				setError(toError(err));
				setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [ds, id, enabled]);

	return { data, loading, error };
}

export function useActivities(
	entityId?: string,
	{ enabled = true }: QueryOptions = {},
): QueryResult<Activity[]> {
	const ds = useDataSource();
	const [data, setData] = useState<Activity[]>([]);
	const [loading, setLoading] = useState<boolean>(enabled);
	const [error, setError] = useState<Error | null>(null);

	// `undefined` is a valid value for `entityId` (means "all activities"), so
	// we need a separate sentinel for "never fetched yet". Otherwise the first
	// call with no filter would match the ref and the effect would short circuit.
	const lastEntityIdRef = useRef<string | undefined | typeof UNSET>(UNSET);

	useEffect(() => {
		if (!enabled) {
			setLoading(false);
			return;
		}
		if (lastEntityIdRef.current === entityId)
			return;
		const isFirstRun = lastEntityIdRef.current === UNSET;
		lastEntityIdRef.current = entityId;

		let cancelled = false;
		if (!isFirstRun)
			setLoading(true);
		setError(null);
		ds.getActivities(entityId)
			.then((result) => {
				if (cancelled)
					return;
				setData(result);
				setLoading(false);
			})
			.catch((err: unknown) => {
				if (cancelled)
					return;
				setError(toError(err));
				setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [ds, entityId, enabled]);

	return { data, loading, error };
}

export function useSummaries({
	enabled = true,
}: QueryOptions = {}): QueryResult<Summary[]> {
	const ds = useDataSource();
	const [data, setData] = useState<Summary[]>([]);
	const [loading, setLoading] = useState<boolean>(enabled);
	const [error, setError] = useState<Error | null>(null);
	const fetchedRef = useRef(false);

	useEffect(() => {
		if (!enabled) {
			setLoading(false);
			return;
		}
		if (fetchedRef.current)
			return;
		fetchedRef.current = true;

		let cancelled = false;
		setError(null);
		ds.getSummaries()
			.then((result) => {
				if (cancelled)
					return;
				setData(result);
				setLoading(false);
			})
			.catch((err: unknown) => {
				if (cancelled)
					return;
				setError(toError(err));
				setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [ds, enabled]);

	return { data, loading, error };
}
