/**
 * Normalizes a path by ensuring it starts with '/'
 */
export function normalizePath(path: string): string {
  if (!path.startsWith('/')) {
    return '/' + path;
  }
  return path;
}

/**
 * Creates a formatted debug log string
 */
export function debugLog(title: string, data: any): string {
  console.error(`\n===== DEBUG: ${title} =====`);
  console.error(JSON.stringify(data, null, 2));
  console.error(`===== END DEBUG: ${title} =====\n`);
  
  return `\n===== DEBUG: ${title} =====\n${JSON.stringify(data, null, 2)}\n===== END DEBUG: ${title} =====\n`;
}

/**
 * Type guards
 */
import { 
  ListPagesArgs, 
  GetPageArgs, 
  CreatePageArgs, 
  UpdatePageArgs,
  SearchPagesArgs
} from '../types/index.js';

export function isListPagesArgs(args: unknown): args is ListPagesArgs {
  return (
    typeof args === "object" &&
    args !== null
  );
}

export function isGetPageArgs(args: unknown): args is GetPageArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "path" in args &&
    typeof (args as { path: string }).path === "string"
  );
}

export function isCreatePageArgs(args: unknown): args is CreatePageArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "path" in args &&
    typeof (args as { path: string }).path === "string" &&
    "body" in args &&
    typeof (args as { body: string }).body === "string"
  );
}

export function isUpdatePageArgs(args: unknown): args is UpdatePageArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "path" in args &&
    typeof (args as { path: string }).path === "string" &&
    "body" in args &&
    typeof (args as { body: string }).body === "string"
  );
}

export function isSearchPagesArgs(args: unknown): args is SearchPagesArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "q" in args &&
    typeof (args as { q: string }).q === "string"
  );
}
