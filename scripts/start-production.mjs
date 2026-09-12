import { existsSync } from 'node:fs';

const server = new URL('../.next/standalone/server.js', import.meta.url);
if (!existsSync(server)) throw new Error('Production build missing. Run npm run build first.');
process.env.PORT ||= '3001';
process.env.HOSTNAME = process.env.HELP_HOSTNAME || '0.0.0.0';
await import(server.href);
