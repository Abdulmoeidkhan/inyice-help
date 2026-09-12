import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const output = resolve('.next/standalone');
if (!existsSync(resolve(output, 'server.js'))) throw new Error('Standalone server missing. Run next build first.');
cpSync('public', resolve(output, 'public'), { recursive: true });
cpSync('.next/static', resolve(output, '.next/static'), { recursive: true });
console.log('Single deployable build ready in .next/standalone (server, assets, and generated discovery files).');
