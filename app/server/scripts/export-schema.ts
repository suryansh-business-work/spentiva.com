/**
 * Exports the merged GraphQL SDL to `schema.graphql` at the server root.
 * This artifact is consumed by client-side GraphQL Code Generator (UI + mobile).
 *
 * Run: npm run schema:export
 */
import 'reflect-metadata';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { printSchema, lexicographicSortSchema } from 'graphql';
import { typeDefs, resolvers } from '../src/graphql/modules';

const schema = makeExecutableSchema({ typeDefs, resolvers });
const sdl = printSchema(lexicographicSortSchema(schema));

const outPath = join(__dirname, '..', 'schema.graphql');
writeFileSync(outPath, `${sdl}\n`, 'utf8');

// eslint-disable-next-line no-console
console.log(`✅ Exported GraphQL SDL -> ${outPath}`);
process.exit(0);
