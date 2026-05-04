// Only place in the codebase that should know about mock vs live. If
// anything else imports `mock.ts` or `api.ts` directly, the toggle stops
// working for that consumer.

import type { DataSource } from './contracts';

import process from 'node:process';
import { apiDataSource } from './api';
import { mockDataSource } from './mock';

const mode = process.env.NEXT_PUBLIC_DATA_SOURCE === 'live' ? 'live' : 'mock';

export const dataSource: DataSource
	= mode === 'live' ? apiDataSource : mockDataSource;
