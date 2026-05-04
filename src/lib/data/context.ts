'use client';

// Split out from provider.tsx so that file only exports components.
// A non-component export in the same file as a component breaks Next.js
// Fast Refresh for the whole subtree.

import type { DataSource } from './contracts';

import { createContext } from 'react';

export const DataContext = createContext<DataSource | null>(null);
