#!/usr/bin/env node
/** Stop stale Next.js dev servers that cause white screens and chunk 404 errors. */
import { execSync } from 'node:child_process';

const PORTS = [3000, 3001, 3002, 3003];

for (const port of PORTS) {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
  } catch {
    // No process on this port
  }
}
