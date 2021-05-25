import { extractFunction } from "./extract-function";

export function renameFunction(
    code: string,
    from: string,
    to: string
): string {
    const oldFn = extractFunction(code, from);
    if (!oldFn) {
        throw new Error(`function ${from} not found in code source`);
    }
    // naive, but probably Good Enough
    const renamed = oldFn.replace(from, to);
    return code.replace(oldFn, renamed);
}
