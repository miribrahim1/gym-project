import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/headers') return { url: new URL('./next-headers.mjs', import.meta.url).href, shortCircuit: true };
  if (specifier === 'next/cache' || specifier === 'next/navigation') return { url: new URL('./next-runtime.mjs', import.meta.url).href, shortCircuit: true };
  if (specifier.startsWith('@/')) specifier = pathToFileURL(path.resolve(specifier.slice(2))).href;
  if ((specifier.startsWith('.') || specifier.startsWith('file:')) && !path.extname(specifier)) {
    const url = new URL(specifier, context.parentURL);
    if (existsSync(fileURLToPath(url) + '.js')) specifier = url.href + '.js';
  }
  return nextResolve(specifier, context);
}
