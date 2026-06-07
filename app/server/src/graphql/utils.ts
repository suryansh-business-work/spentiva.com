/** Shared helpers for resolvers. */

export type WithId = { _id?: unknown; id?: unknown };

/** Normalises a Mongoose document/plain object to its string `id`. */
export const resolveId = (parent: WithId): string => String(parent._id ?? parent.id);
