import { extractFunction } from "./extract-function";

export function replaceFunction(
    code: string,
    functionName: string,
    updated: string
): string {
    const existing = extractFunction(code, functionName);
    if (existing.trim() === "") {
        throw new Error(`can't find function ${functionName} in the provided code`);
    }
    return code.replace(existing.trim(), updated.trim());
}
