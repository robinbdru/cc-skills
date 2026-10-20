import { stat } from "node:fs/promises";

/** Whether `error` is the ENOENT a filesystem call throws for a missing path. */
export function isNotFound(error: unknown): boolean {
  return error instanceof Error && (error as NodeJS.ErrnoException).code === "ENOENT";
}

/** Whether `path` exists, following symlinks. Rethrows any error other than "not found". */
export async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (isNotFound(error)) return false;
    throw error;
  }
}
