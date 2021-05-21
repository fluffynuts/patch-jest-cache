import { FsEntities, ls } from "yafs";
import { Optional } from "./types";

const baseSearch = "node_modules/@jest";

export async function findScriptTransformer(): Promise<string> {
    const search = await findJestFiles(/ScriptTransformer.js$/);
    if (search.length === 0) {
        throw new Error(`Unable to find ScriptTransformer.js under ${ baseSearch }`);
    }
    if (search.length > 1) {
        throw new Error(`Multiple matches for ScriptTransformer.js under ${ baseSearch }:\n${ search.join("\n") }`);
    }
    return search[0];
}

export async function findScriptTransformerBackup(): Promise<Optional<string>> {
    const search = await findJestFiles(/ScriptTransformer.js.original$/);
    return search[0];
}

export function generateBackupFileName(fileName: string) {
    return `${ fileName }.original`;
}

export function findJestFiles(matching: RegExp): Promise<string[]> {
    return ls(baseSearch, {
        recurse: true,
        fullPaths: true,
        entities: FsEntities.files,
        match: matching
    });
}
